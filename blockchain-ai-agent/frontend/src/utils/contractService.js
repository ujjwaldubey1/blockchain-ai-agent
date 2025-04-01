import { ethers } from "ethers";
import getProvider from "./web3Provider";  // Use the provider helper function
import contractABI from "./contractABI.json"; // Ensure ABI is correct

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // Store in .env
console.log("📌 Contract Address:", CONTRACT_ADDRESS);
console.log("contractAbi : " , contractABI)

export const getContract = async () => {
    const provider = getProvider();
    if (!provider) {
        console.error("❌ Provider is not available. MetaMask might not be installed.");
        return null;
    }

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" }); // Ensure wallet is connected
        const signer = await provider.getSigner(); // ✅ Await is required in Ethers v6
        console.log("✅ Wallet connected! Address:", await signer.getAddress());
        
        return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    } catch (error) {
        console.error("⚠️ Error getting signer or contract:", error);
        return null;
    }
};

export const swapTokens = async (amount, targetChain) => {
    const contract = await getContract();
    if (!contract) return null; // Avoid errors if the contract is not available

    try {
        const tx = await contract.swapTokens(amount, targetChain);  // Call the `swapTokens` method
        console.log("✅ Swap Transaction Sent! Hash:", tx.hash);
        await tx.wait();  // Wait for transaction confirmation
        console.log("✅ Swap Transaction Confirmed!");
        return tx;
    } catch (error) {
        console.error("⚠️ Error swapping tokens:", error);
        return null;
    }
};

// Optional: Listen to SwapExecuted events
export const listenForSwapExecuted = () => {
    const contract = getContract();
    if (!contract) return; // Avoid errors if the contract is not available

    contract.on("SwapExecuted", (user, amount, targetChain) => {
        console.log(`🚀 Swap Executed! User: ${user}, Amount: ${amount}, Target Chain: ${targetChain}`);
    });
};
