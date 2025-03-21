require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");

// Constants
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Wallet private key
const ETH_THRESHOLD = 5; // % drop to trigger trade

// Uniswap Swap Router
const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// Provider & Wallet
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Get ETH Price
async function getEthPrice() {
  const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
  return response.data.ethereum.usd;
}

// Swap Function (ETH → USDT)
async function executeTrade() {
  console.log("📉 ETH dropped 5%! Buying ETH...");
  // Add Uniswap trade logic here
}

// Monitor Price & Trigger Trade
let lastPrice = 0;

async function monitorPrice() {
  const currentPrice = await getEthPrice();
  console.log(`🟢 Current ETH Price: $${currentPrice}`);

  if (lastPrice && currentPrice < lastPrice * (1 - ETH_THRESHOLD / 100)) {
    await executeTrade();
  }
  lastPrice = currentPrice;
}

// Run every 5 minutes
setInterval(monitorPrice, 300000);
