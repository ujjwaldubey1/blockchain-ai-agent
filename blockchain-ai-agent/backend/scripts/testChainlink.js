import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from the root level (same level as backend)
const envPath = path.resolve(__dirname, "../../.env");
console.log(`🟢 Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

// ✅ Debugging: Check if variables are loaded
console.log("🔍 CHAINLINK_ORACLE:", process.env.CHAINLINK_ORACLE || "Not Loaded");
console.log("🔍 INFURA_RPC_URL:", process.env.INFURA_RPC_URL || "Not Loaded");
console.log("🔍 RPC_URL:", process.env.RPC_URL || "Not Loaded");
console.log("🔍 MONGO_URI:", process.env.MONGO_URI || "Not Loaded");

if (!process.env.CHAINLINK_ORACLE || !process.env.INFURA_RPC_URL || !process.env.RPC_URL || !process.env.MONGO_URI) {
    console.error("❌ Missing environment variables. Check .env file!");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:", err);
        process.exit(1);
    });

// ✅ Define Schema & Model for Storing Prices
const priceSchema = new mongoose.Schema({
    price: Number,
    timestamp: { type: Date, default: Date.now }
});
const Price = mongoose.model("Price", priceSchema);

// ✅ Provider & Oracle Setup
const oracleAddress = process.env.CHAINLINK_ORACLE;
const abi = ["function latestAnswer() public view returns (int256)"];

async function getChainlinkPrice() {
    try {
        let provider;
        try {
            console.log("🔄 Trying Infura connection...");
            provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC_URL);
        } catch (error) {
            console.log("⚠️ Infura connection failed, falling back to Alchemy...");
            provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        }

        const oracle = new ethers.Contract(oracleAddress, abi, provider);
        const price = await oracle.latestAnswer();
        const formattedPrice = parseFloat(ethers.utils.formatUnits(price, 8));

        console.log(`✅ ETH/USD Price from Chainlink: $${formattedPrice}`);

        // ✅ Save price to MongoDB
        const priceEntry = new Price({ price: formattedPrice });
        await priceEntry.save();
        console.log("💾 Price data saved to MongoDB");

        // ✅ Optional: Trigger action if price crosses a threshold
        if (formattedPrice > 2000) {
            console.log("🚀 Price above $2000! Consider triggering an action.");
        }

    } catch (error) {
        console.error("❌ Error fetching Chainlink price:", error);
    }
}

// ✅ Execute Swap Function (Dummy Implementation)
async function executeSwap() {
    try {
        let provider;
        try {
            console.log("🔄 Trying Infura connection...");
            provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC_URL);
        } catch (error) {
            console.log("⚠️ Infura connection failed, falling back to Alchemy...");
            provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        }

        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log("🚀 Wallet initialized successfully!");

        // 🚀 Add swap logic here
        console.log("🔄 Swap function is under development...");

    } catch (error) {
        console.error("❌ Transaction failed:", error);
    }
}

// ✅ Call Functions
getChainlinkPrice();