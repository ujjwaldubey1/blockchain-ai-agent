import { ethers } from "ethers";

const getProvider = () => {
    if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    } else {
        console.error("No Ethereum wallet found!");
        return null;
    }
};

export default getProvider;
