const { ethers } = require("ethers");

async function executeSwap() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract("<DEPLOYED_CONTRACT_ADDRESS>", ["function swapTokens(uint256, string)"], wallet);

    const tx = await contract.swapTokens(100, "Binance Smart Chain");
    await tx.wait();

    console.log("Swap executed successfully!");
}

executeSwap();
