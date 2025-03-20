import { JsonRpcProvider, Wallet, formatEther } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

async function checkBalance() {
    if (!process.env.PRIVATE_KEY || !process.env.RPC_URL) {
        throw new Error("❌ Please set PRIVATE_KEY and RPC_URL in your .env file");
    }

    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

    const network = await provider.getNetwork();
console.log(`Connected to ${network.name}`);

    console.log(`Wallet Address: ${wallet.address}`);
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Wallet Balance: ${formatEther(balance)} ETH`);
}

checkBalance().catch(console.error);
