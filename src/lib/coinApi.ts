import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

export const getCoinData = async (coinId: string) => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    throw error;
  }
};

export const getTopCoins = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 20,
        page: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top coins data:", error);
    throw error;
  }
};
