import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const cacheDuration = 1000 * 60 * 5; // 5분
const cache: { [key: string]: { data: any; timestamp: number } } = {};

export const fetchCryptoNews = async () => {
  const cacheKey = "cryptoNews";

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/news`);
    const data = response.data;

    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    throw error;
  }
};

export const getTopCoins = async (
  vs_currency: string = "usd",
  per_page: number = 100
) => {
  const cacheKey = `topCoins-${vs_currency}-${per_page}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency,
        order: "market_cap_desc",
        per_page,
        page: 1,
      },
    });

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching top coins:", error);
    throw error;
  }
};

export const fetchNftById = async (nftId: string) => {
  const cacheKey = `nft-${nftId}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/nfts/${nftId}`);

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error(`Error fetching NFT data for ${nftId}:`, error);
    throw error;
  }
};

export const getCoinData = async (
  coinId: string,
  period: "1d" | "7d" | "30d"
) => {
  const cacheKey = `coinData-${coinId}-${period}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: period,
        },
      }
    );

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    throw error;
  }
};

export const fetchCoinDetailById = async (coinId: string) => {
  const cacheKey = `coinDetail-${coinId}`;

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}`);

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error(`Error fetching coin detail data for ${coinId}:`, error);
    throw error;
  }
};

export const exchangeList = async () => {
  const cacheKey = "exchangeList";

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/exchanges`);

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching exchange list:", error);
    throw error;
  }
};

export const getGlobalMarketData = async () => {
  const cacheKey = "globalMarketData";

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`);
    const data = response.data;

    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error("Error fetching global market data:", error);
    throw error;
  }
};
