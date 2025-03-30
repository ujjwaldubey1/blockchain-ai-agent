import { ethers } from 'ethers';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("Using RPC URL:", process.env.SEPOLIA_RPC_URL);

// Use providers.JsonRpcProvider for ethers v6
const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function checkLayerZero() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Connected! Latest Block: ${blockNumber}`);
    } catch (error) {
        console.error("❌ Error checking LayerZero Endpoint:", error);
    }
}

checkLayerZero();

// Example function to check connection
async function checkConnection() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("✅ Connected to network! Current block:", blockNumber);
    } catch (error) {
        console.error("❌ Connection failed:", error);
    }
}

checkConnection().catch(console.error);
