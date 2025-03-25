import { ethers } from "ethers";

const getProvider = () => {
    if (!window.ethereum) {
        console.error("No Ethereum wallet found!");
        return null;
    }
    console.log("MetaMask detected:", window.ethereum);
    return new ethers.BrowserProvider(window.ethereum); // ✅ Update this line
};

export default getProvider;
