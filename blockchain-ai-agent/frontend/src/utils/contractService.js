import { ethers } from "ethers";
import getProvider from "./web3Provider";  // Use the provider helper function
import contractABI from "./contractABI.json"; // Ensure ABI is correct

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS; // Store in .env
console.log("📌 Contract Address:", CONTRACT_ADDRESS);

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

export const getSwapData = async () => {
    const contract = await getContract();
    if (!contract) return null; // Avoid errors if the contract is not available

    try {
        const data = await contract.getSwapData(); // Ensure `getSwapData` exists in contract
        console.log("🔄 Swap Data:", data);
        return data;
    } catch (error) {
        console.error("⚠️ Error fetching swap data:", error);
        return null;
    }
};
