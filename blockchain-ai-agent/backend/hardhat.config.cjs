require("@nomicfoundation/hardhat-toolbox");
const path = require('path');
require("dotenv").config();

// Load environment variables from the correct path
require('dotenv').config({
  path: path.join(__dirname, '.env')  // Changed from default to explicit path
});

// Debug: Print the path where we're looking for .env
console.log("📁 Loading environment variables from:", path.join(__dirname, '.env'));

// Debug: Print loaded values
console.log("🔍 Checking RPC URL:", process.env.SEPOLIA_RPC_URL?.substring(0, 40) + "...");

// Validate environment variables
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Debug: Print loaded values (redacted for security)
console.log("SEPOLIA_RPC_URL:", SEPOLIA_RPC_URL ? "✅ Loaded" : "❌ Missing");
console.log("PRIVATE_KEY:", PRIVATE_KEY ? "✅ Loaded" : "❌ Missing");

if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

if (!process.env.SEPOLIA_RPC_URL?.includes("YOUR-API-KEY")) {
  /** @type import('hardhat/config').HardhatUserConfig */
  module.exports = {
    solidity: "0.8.17",
    networks: {
      localhost: {
        url: "http://127.0.0.1:8545"
      },
      sepolia: {
        url: SEPOLIA_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 11155111,
        timeout: 60000
      },
      ...(MAINNET_RPC_URL ? {
        mainnet: {
          url: MAINNET_RPC_URL,
          accounts: [PRIVATE_KEY]
        }
      } : {})
    },
    // Add mocha timeout
    mocha: {
      timeout: 100000 // 100 seconds
    }
  };
} else {
  console.error("❌ Please replace YOUR-API-KEY in .env with your actual Alchemy API key");
  process.exit(1);
} 