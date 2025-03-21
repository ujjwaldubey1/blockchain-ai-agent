import axios from "axios";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config(); // Load API keys from .env

const { INFURA_RPC_URL, CHAINLINK_ORACLE, ONE_INCH_API, PARASWAP_API, UNISWAP_API } = process.env;

// Ethereum provider
const provider = new ethers.JsonRpcProvider(INFURA_RPC_URL);

// Function to get price from Chainlink Oracle
async function getChainlinkPrice(assetAddress) {
    try {
        const oracle = new ethers.Contract(CHAINLINK_ORACLE, [
            "function latestAnswer() public view returns (int256)"
        ], provider);
        const price = await oracle.latestAnswer();
        return ethers.formatUnits(price, 8); // Adjust decimals if needed
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

    const bestPrice = Math.max(oneInchPrice || 0, paraswapPrice || 0, uniswapPrice || 0);
    
    if (!bestPrice) {
        console.log("No valid price found.");
        return null;
    }

    let bestPlatform = "";
    if (bestPrice === oneInchPrice) bestPlatform = "1inch";
    else if (bestPrice === paraswapPrice) bestPlatform = "Paraswap";
    else if (bestPrice === uniswapPrice) bestPlatform = "Uniswap";

    return { bestPlatform, bestPrice };
}

// Test function
async function main() {
    const fromToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48"; // USDC
    const toToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
    const amount = ethers.parseUnits("1", 6); // 1 USDC (6 decimals)

    const result = await getBestSwapRate(fromToken, toToken, amount);
    if (result) {
        console.log(`Best rate found on ${result.bestPlatform}: ${ethers.formatUnits(result.bestPrice, 18)} ETH`);
    }
}

main();
