const hre = require("hardhat");
require("dotenv").config(); // Load environment variables

async function main() {
    console.log("📁 Loading environment variables...");

    // ✅ Use Sepolia Uniswap Router & WETH addresses
    const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router for Sepolia
    const wethAddress = "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15"; // ✅ Correct Sepolia WETH Address

    console.log("🚀 Getting contract factory...");
    const SwapContract = await hre.ethers.getContractFactory("SwapContract");

    console.log("⏳ Deploying contract...");
    const swapContract = await SwapContract.deploy(swapRouterAddress, wethAddress);
    
    console.log("⏳ Waiting for deployment...");
    await swapContract.deployed();

    console.log("✅ SwapContract successfully deployed to:", swapContract.address);

    // ✅ Save contract address to `.env`
    console.log("✍️ Updating CONTRACT_ADDRESS in .env file...");
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(__dirname, "../.env");

    try {
        let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
        if (envContent.includes("CONTRACT_ADDRESS=")) {
            envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${swapContract.address}`);
        } else {
            envContent += `\nCONTRACT_ADDRESS=${swapContract.address}`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log("✅ CONTRACT_ADDRESS updated in .env file:", swapContract.address);
    } catch (error) {
        console.error("❌ Failed to update .env file:", error);
    }
}

// Execute deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
