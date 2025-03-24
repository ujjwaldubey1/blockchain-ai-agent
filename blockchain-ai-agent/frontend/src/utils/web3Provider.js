import { ethers } from "ethers";

const getProvider = () => {
    if (!window.ethereum) {
        console.error("No Ethereum wallet found!");
        return null;
    }
    return new ethers.providers.Web3Provider(window.ethereum);
};

export default getProvider;
