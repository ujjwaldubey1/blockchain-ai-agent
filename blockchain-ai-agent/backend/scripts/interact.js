import { JsonRpcProvider, Wallet, Contract } from "ethers";
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
    console.log("Loaded PRIVATE_KEY:", process.env.PRIVATE_KEY ? "✅ Loaded" : "❌ Missing");
    console.log("Loaded RPC_URL:", process.env.RPC_URL ? "✅ Loaded" : "❌ Missing");
    console.log("Loaded CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS ? "✅ Loaded" : "❌ Missing");
    
    if (!process.env.PRIVATE_KEY || !process.env.RPC_URL || !process.env.CONTRACT_ADDRESS) {
        throw new Error("❌ Please set PRIVATE_KEY, RPC_URL, and CONTRACT_ADDRESS in your .env file");
    }

    // ✅ Correct Ethers v6 Syntax
    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);  // ✅ Removed `ethers.Wallet`

    // ✅ Smart contract ABI (Replace with actual ABI JSON)
    const contractABI = [
        "function swapTokens(uint256 amount, string network)"
    ];

    // ✅ Initialize contract using named import
    const contract = new Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

    try {
        console.log("🚀 Executing Swap...");
        const tx = await contract.swapTokens(100, "Binance Smart Chain");
        await tx.wait();
        console.log("✅ Swap executed successfully!");
    } catch (error) {
        console.error("❌ Transaction failed:", error);
    }
}

executeSwap().catch(console.error);
