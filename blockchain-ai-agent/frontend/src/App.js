import React, { useState } from "react";
import getProvider from "./utils/web3Provider";

function App() {
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        const provider = getProvider();
        if (provider) {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
        }
    };

    return (
        <div>
            <button onClick={connectWallet}>
                {account ? `Connected: ${account}` : "Connect Wallet"}
            </button>
        </div>
    );
}

export default App;
