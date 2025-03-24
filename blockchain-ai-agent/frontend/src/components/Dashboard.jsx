import React, { useEffect, useState } from "react"
import { getPriceData } from "../utils/apiService"

function Dashboard() {
	const [price, setPrice] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			const data = await getPriceData()
			setPrice(data)
		}
		fetchData()
	}, [])

	return (
		<div>
			<h2>Token Price: {price ? `${price} USD` : "Loading..."}</h2>
		</div>
	)
}

export default Dashboard
