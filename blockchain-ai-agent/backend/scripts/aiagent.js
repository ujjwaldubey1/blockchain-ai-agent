import "dotenv/config";
import axios from "axios";
import { ethers } from "ethers";

const API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
let lastPrice = null; // Store previous price

// Fetch ETH price
async function fetchPrice() {
    try {
        const response = await axios.get(API_URL);
        console.log("API Response:", response.data);
        const price = response.data.ethereum.usd;
        console.log(`💰 Current ETH Price: $${price}`);
        return price;
    } catch (error) {
        console.error("❌ Error fetching price:", error.message);
        return null;
    }
}

// AI Decision-making based on price changes
async function aiDecision() {
    const price = await fetchPrice();
    if (!price) return;

    if (lastPrice !== null) {
        if (price > lastPrice) {
            console.log("📈 AI Decision: ETH price is rising. Monitor before buying.");
        } else if (price < lastPrice) {
            console.log("📉 AI Decision: ETH price is falling. Might be a good time to buy!");
        } else {
            console.log("⚖️ AI Decision: ETH price is stable. Hold for now.");
        }
    } else {
        console.log(price < 3000 ? "🔵 AI Decision: ETH is cheap, consider buying!" : "🔴 AI Decision: ETH is expensive, wait to buy.");
    }

    lastPrice = price; // Update last price for next comparison
}

// Run AI decision every 30 seconds
setInterval(aiDecision, 30000);

// First immediate execution
aiDecision();
