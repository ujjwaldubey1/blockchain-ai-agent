import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";  // Update this for production

export const getPriceData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/price`);
        return response.data;
    } catch (error) {
        console.error("Error fetching price data:", error);
        return null;
    }
};
