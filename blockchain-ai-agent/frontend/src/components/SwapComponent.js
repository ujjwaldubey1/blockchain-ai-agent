import React, { useState, useEffect } from "react";
import { getSwapData } from "./utils/contractService";

function SwapComponent() {
    const [swapInfo, setSwapInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSwapData();
            setSwapInfo(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Swap Data: {swapInfo || "Fetching..."}</h2>
        </div>
    );
}

export default SwapComponent;
