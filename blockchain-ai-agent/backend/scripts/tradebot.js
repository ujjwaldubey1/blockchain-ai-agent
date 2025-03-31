import { JsonRpcProvider, Wallet } from "ethers";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Load env variables
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETH_THRESHOLD = 5; // % drop to trigger trade

// Uniswap Swap Router
const UNISWAP_ROUTER = "0xE51D6759178e124D2BF626223fB8D7037a5CF521";

// Provider & Wallet (✅ Compatible with Ethers v6)
const provider = new JsonRpcProvider(INFURA_RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

// Get ETH Price
async function getEthPrice() {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    return response.data.ethereum.usd;
  } catch (error) {
    console.error("❌ Error fetching ETH price:", error);
    return null;
  }
}

// Swap Function (ETH → USDT)
async function executeTrade() {
  console.log("📉 ETH dropped 5%! Buying ETH...");
  // Uniswap trade logic goes here
}

// Monitor Price & Trigger Trade
let lastPrice = null;

async function monitorPrice() {
  const currentPrice = await getEthPrice();
  
  if (!currentPrice) return; // Skip if price fetch fails

  console.log(`🟢 Current ETH Price: $${currentPrice}`);

  if (lastPrice !== null && currentPrice < lastPrice * (1 - ETH_THRESHOLD / 100)) {
    await executeTrade();
  }

  lastPrice = currentPrice;
}

// Run every 5 minutes
setInterval(monitorPrice, 300000);

// Initial price check on script start
monitorPrice();
