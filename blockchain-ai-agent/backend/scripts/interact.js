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

async function executeSwap() {
    console.log("📁 Loading environment variables from:", path.join(__dirname, "../.env"));

    const { PRIVATE_KEY, SEPOLIA_RPC_URL, CONTRACT_ADDRESS } = process.env;

    if (!PRIVATE_KEY || !SEPOLIA_RPC_URL || !CONTRACT_ADDRESS) {
        console.error("❌ Missing required environment variables. Check your .env file.");
        console.log(`PRIVATE_KEY: ${PRIVATE_KEY ? "✅ Loaded" : "❌ Missing"}`);
        console.log(`SEPOLIA_RPC_URL: ${SEPOLIA_RPC_URL ? "✅ Loaded" : "❌ Missing"}`);
        console.log(`CONTRACT_ADDRESS: ${CONTRACT_ADDRESS ? "✅ Loaded" : "❌ Missing"}`);
        process.exit(1);
    }

    try {
        console.log("🔗 Connecting to blockchain...");
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        const contractABI = [
            "function swapTokens(uint256 amount, string memory network) public"
        ];

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

        console.log("🚀 Executing Swap...");
        const amount = ethers.parseUnits("100", 18); // ethers.utils.parseUnits -> ethers.parseUnits in v6
        const tx = await contract.swapTokens(amount, "Binance Smart Chain");

        console.log("⏳ Waiting for transaction confirmation...");
        const receipt = await provider.waitForTransaction(tx.hash); // Using provider.waitForTransaction()

        console.log("✅ Swap executed successfully! Tx Hash:", receipt.hash);
    } catch (error) {
        console.error("❌ Transaction failed:", error);
    }
}

executeSwap().catch(console.error);
