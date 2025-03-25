import React, { useState } from "react"
import getProvider from "./utils/web3Provider"
import contractABI from "./contractABI.json"
import { ethers } from "ethers"

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

function App() {
	const [account, setAccount] = useState("")
	const [swapData, setSwapData] = useState(null)

	console.log("📌 Contract ABI:", contractABI)
	console.log("📌 Contract Address:", CONTRACT_ADDRESS)
	console.log(
		"✅ VITE_CONTRACT_ADDRESS:",
		import.meta.env.VITE_CONTRACT_ADDRESS
	)

	const connectWallet = async () => {
		try {
			const provider = getProvider()
			if (!provider) {
				alert("Please install MetaMask.")
				return
			}

			await window.ethereum.request({ method: "eth_requestAccounts" })

			const signer = await provider.getSigner()
			const address = await signer.getAddress()
			setAccount(address)
			console.log("✅ Wallet connected:", address)
		} catch (error) {
			console.error("⚠️ Error connecting wallet:", error)
		}
	}

	const fetchSwapData = async () => {
		try {
			const provider = getProvider()
			const signer = provider.getSigner()
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				contractABI,
				signer
			)

			const data = await contract.getSwapData() // Update method if needed
			setSwapData(data)
			console.log("🔄 Swap Data:", data)
		} catch (error) {
			console.error("⚠️ Error fetching swap data:", error)
		}
	}

	return (
		<div>
			<button onClick={connectWallet}>
				{account
					? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
					: "Connect Wallet"}
			</button>

			<button onClick={fetchSwapData} disabled={!account}>
				Get Swap Data
			</button>

			{swapData && <p>Swap Data: {JSON.stringify(swapData)}</p>}
		</div>
	)
}

export default App
