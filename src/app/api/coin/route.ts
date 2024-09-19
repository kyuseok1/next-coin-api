import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const cacheDuration = 1000 * 60 * 5; // 5분
const cache: { [key: string]: { data: any; timestamp: number } } = {};

// 백오프 전략 함수
const fetchWithBackoff = async (
  url: string,
  retries: number = 3,
  delay: number = 1000
) => {
  try {
    const response = await fetch(url);
    if (!response.ok && response.status === 429 && retries > 0) {
      console.log(`Too many requests. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithBackoff(url, retries - 1, delay * 2);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

const setCorsHeaders = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
};

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
// nftList 함수 추가
export const nftList = async () => {
  const cacheKey = "nftList";

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/nfts/list`);

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching NFT list:", error);
    throw error;
  }
};
export const fetchNftById = async (nftId: string) => {
  const cacheKey = `nft-${nftId}`;

  // 캐시된 데이터가 있는지 확인
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    // CoinGecko API로 NFT 데이터 요청
    const response = await axios.get(`${COINGECKO_API_URL}/nfts/${nftId}`);

    // 캐시 저장
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
export const exchangeList = async () => {
  const cacheKey = "exchangeList";

  // 캐시된 데이터가 있는지 확인
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    return cache[cacheKey].data;
  }

  try {
    // CoinGecko API로 거래소 데이터 요청
    const response = await axios.get(`${COINGECKO_API_URL}/exchanges`);

    // 캐시 저장
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const period = searchParams.get("period") || "7d";
  const fetchTrendingCoins = searchParams.get("fetchTrendingCoins") === "true";
  const fetchGlobalMarketDataFlag =
    searchParams.get("fetchGlobalMarketData") === "true";
  const fetchCoinByIdFlag = searchParams.get("fetchCoinById") === "true";
  const fetchCoinsFlag = searchParams.get("fetchCoins") === "true";
  const fetchNftByIdFlag = searchParams.get("fetchNftById") === "true";
  const fetchExchangeListFlag =
    searchParams.get("fetchExchangeList") === "true"; // 추가된 부분
  const nftId = searchParams.get("nftId"); // NFT ID 가져오기
  const per_page = Number(searchParams.get("per_page")) || 100;

  try {
    let response;

    if (fetchTrendingCoins) {
      const trendingCoins = await getTopCoins("usd", per_page);
      response = NextResponse.json(trendingCoins);
    } else if (fetchGlobalMarketDataFlag) {
      const globalMarketData = await getGlobalMarketData();
      response = NextResponse.json(globalMarketData);
    } else if (fetchCoinByIdFlag && coinId) {
      const coinData = await getCoinData(coinId, period as "1d" | "7d" | "30d");
      response = NextResponse.json(coinData);
    } else if (fetchCoinsFlag) {
      const topCoins = await getTopCoins("usd", per_page);
      response = NextResponse.json(topCoins);
    } else if (fetchNftByIdFlag && nftId) {
      const nftData = await fetchNftById(nftId);
      response = NextResponse.json(nftData);
    } else if (fetchExchangeListFlag) {
      // 거래소 데이터를 요청할 경우
      const exchangeData = await exchangeList();
      response = NextResponse.json(exchangeData);
    } else {
      response = NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error("API error:", error);
    const errorResponse = NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
    setCorsHeaders(errorResponse);
    return errorResponse;
  }
}
