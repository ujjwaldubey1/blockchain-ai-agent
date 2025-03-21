import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the root directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("Using RPC URL:", process.env.RPC_URL); // Debugging check

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

async function checkLayerZero() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Connected! Latest Block: ${blockNumber}`);
    } catch (error) {
        console.error("❌ Error checking LayerZero Endpoint:", error);
    }
}

checkLayerZero();
