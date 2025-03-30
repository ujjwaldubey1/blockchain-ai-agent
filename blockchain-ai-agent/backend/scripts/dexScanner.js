import axios from "axios";
import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const { INFURA_RPC_URL, CHAINLINK_ORACLE, ONE_INCH_API, PARASWAP_API, UNISWAP_API } = process.env;
console.log("Using RPC URL:", INFURA_RPC_URL);

// Create provider using ethers.providers.JsonRpcProvider (Ethers v5)
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);

async function checkConnection() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("✅ Connected to network! Current block:", blockNumber);
        
        const network = await provider.getNetwork();
        console.log("Network:", network.name);
        
    } catch (error) {
        console.error("❌ Connection failed:", error);
    }
}

checkConnection().catch(console.error);

// Function to get price from Chainlink Oracle
async function getChainlinkPrice(assetAddress) {
    try {
        const oracle = new ethers.Contract(CHAINLINK_ORACLE, [
            "function latestAnswer() public view returns (int256)"
        ], provider);
        const price = await oracle.latestAnswer();
        return ethers.utils.formatUnits(price, 8); // Adjust decimals if needed
    } catch (error) {
        console.error("Error fetching Chainlink price:", error);
        return null;
    }
}

// Function to fetch swap rate from 1inch API
async function get1InchPrice(fromToken, toToken, amount) {
    try {
        const response = await axios.get(`${ONE_INCH_API}/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`);
        return response.data.toTokenAmount;
    } catch (error) {
        console.error("Error fetching 1inch price:", error.response?.data || error);
        return null;
    }
}

// Function to fetch swap rate from Paraswap API
async function getParaswapPrice(fromToken, toToken, amount) {
    try {
        const response = await axios.get(`${PARASWAP_API}/prices?srcToken=${fromToken}&destToken=${toToken}&amount=${amount}`);
        return response.data.priceRoute.destAmount;
    } catch (error) {
        console.error("Error fetching Paraswap price:", error.response?.data || error);
        return null;
    }
}

// Function to fetch swap rate from Uniswap API (Uniswap V3)
async function getUniswapPrice(fromToken, toToken, amount) {
    try {
        const response = await axios.get(`${UNISWAP_API}/quote?inputToken=${fromToken}&outputToken=${toToken}&amount=${amount}`);
        return response.data.amountOut;
    } catch (error) {
        console.error("Error fetching Uniswap price:", error.response?.data || error);
        return null;
    }
}

// Compare prices and select the best swap option
async function getBestSwapRate(fromToken, toToken, amount) {
    const [oneInchPrice, paraswapPrice, uniswapPrice] = await Promise.all([
        get1InchPrice(fromToken, toToken, amount),
        getParaswapPrice(fromToken, toToken, amount),
        getUniswapPrice(fromToken, toToken, amount)
    ]);

    console.log("Swap Rates:", { oneInchPrice, paraswapPrice, uniswapPrice });

    const bestPrice = Math.max(
        oneInchPrice ? parseFloat(oneInchPrice) : 0, 
        paraswapPrice ? parseFloat(paraswapPrice) : 0, 
        uniswapPrice ? parseFloat(uniswapPrice) : 0
    );
    
    if (!bestPrice) {
        console.log("No valid price found.");
        return null;
    }

    let bestPlatform = "";
    if (bestPrice === parseFloat(oneInchPrice)) bestPlatform = "1inch";
    else if (bestPrice === parseFloat(paraswapPrice)) bestPlatform = "Paraswap";
    else if (bestPrice === parseFloat(uniswapPrice)) bestPlatform = "Uniswap";

    return { bestPlatform, bestPrice };
}

// Test function
async function main() {
    const fromToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48"; // USDC
    const toToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
    const amount = ethers.utils.parseUnits("1", 6); // 1 USDC (6 decimals)

    const result = await getBestSwapRate(fromToken, toToken, amount);
    if (result) {
        console.log(`Best rate found on ${result.bestPlatform}: ${ethers.utils.formatUnits(result.bestPrice, 18)} ETH`);
    }
}

main();
