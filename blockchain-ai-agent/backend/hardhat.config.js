const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL || "";
const privateKey = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      forking: process.env.MAINNET_RPC_URL
        ? { url: process.env.MAINNET_RPC_URL }
        : undefined
    },
    ...(privateKey
      ? {
          mainnet: {
            url: process.env.MAINNET_RPC_URL || "",
            accounts: [privateKey],
            chainId: 1
          },
          sepolia: {
            url: sepoliaRpcUrl, // Ensure it's not undefined
            accounts: [privateKey],
            chainId: 11155111
          }
        }
      : {})
  }
};
