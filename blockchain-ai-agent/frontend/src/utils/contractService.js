  import { ethers } from "ethers";
  import contractABI from "./contractABI.json"; // Ensure ABI is correct

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS; // Store in .env
  console.log(CONTRACT_ADDRESS)

  export const getContract = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  };

  export const getSwapData = async () => {
      const contract = await getContract();
      const data = await contract.getSwapData(); // Update method as per your contract
      return data;
  };
