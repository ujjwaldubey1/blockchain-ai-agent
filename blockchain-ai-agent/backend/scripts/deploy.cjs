const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const SwapContract = await ethers.getContractFactory("SwapContract");
    
    // Deploy the contract
    console.log("Deploying SwapContract...");
    const swapContract = await SwapContract.deploy();
    await swapContract.deployed();

    console.log("SwapContract deployed to:", swapContract.address);
}

// Execute the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
