import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// 메모리 캐시 설정
const cache: { [key: string]: any } = {};

export const fetchCoins = async (filterType: string, page: number) => {
  const endpoint =
    filterType === "trending"
      ? "/api/coin?fetchTrendingCoins=true"
      : `/api/coin?page=${page}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    return Array.isArray(data)
      ? data
      : data.coins.map((coin: any) => ({
          id: coin.item.id,
          symbol: coin.item.symbol,
          name: coin.item.name,
          image: { thumb: coin.item.thumb },
          market_data: {
            current_price: { usd: coin.item.price_btc * 1000000 },
          },
          type: "trending",
        }));
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

export const fetchCoinById = async (coinId: string) => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/${coinId}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

export const getCoinData = async (coinId: string, days: number) => {
  const cacheKey = `coinData-${coinId}-${days}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: days,
        },
      }
    );

    const data = response.data;
    cache[cacheKey] = data; // 캐시 저장
    return data;
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

export const getTopCoins = async () => {
  const cacheKey = "topCoins";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
      },
    });

    const data = response.data;
    cache[cacheKey] = data; // 캐시 저장
    return data;
  } catch (error) {
    console.error("Error fetching top coins data:", error);
    throw error;
  }
};

export const getTrendingCoins = async () => {
  const cacheKey = "trendingCoins";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/search/trending`);

    const data = response.data;
    cache[cacheKey] = data; // 캐시 저장
    return data;
  } catch (error) {
    console.error("Error fetching trending coins data:", error);
    throw error;
  }
};

export const getGlobalMarketData = async () => {
  const cacheKey = "globalMarketData";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`);

    const data = response.data;
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("Error fetching global market data:", error);
    throw error;
  }
};
