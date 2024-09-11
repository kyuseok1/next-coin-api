import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// CoinGecko API URL
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// 메모리 캐시 설정
const cache: { [key: string]: any } = {};

// 코인 데이터 가져오기
const getCoinData = async (coinId: string, days: number) => {
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

// 상위 코인 데이터 가져오기
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
    console.error("상위 코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 트렌딩 코인 데이터 가져오기
const getTrendingCoins = async () => {
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
    console.error("트렌딩 코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 글로벌 시장 데이터 가져오기
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
    console.error("글로벌 시장 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// NFT 데이터 가져오기
const fetchNftData = async (id: string, endpoint: string) => {
  const cacheKey = `nft-${id}-${endpoint}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/nfts/${endpoint}`);
    const data = response.data;
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching NFT data for ID ${id}:`, error);
    throw error;
  }
};

// NFT 리스트 데이터 가져오기
export const nftList = async () => {
  const cacheKey = "nftList";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/nfts/list`);
    const data = response.data;
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("글로벌 시장 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 암호화폐 뉴스 가져오기
export const fetchCryptoNews = async () => {
  const cacheKey = "cryptoNews";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/news`);

    if (Array.isArray(response.data.data)) {
      const articles = response.data.data.map((article: any) => ({
        title: article.title,
        url: article.url,
        description: article.description,
        author: article.author || "Unknown",
        updated_at: new Date(article.updated_at * 1000).toLocaleString(),
        news_site: article.news_site,
        thumb_2x: article.thumb_2x || null,
      }));

      cache[cacheKey] = articles;
      return articles;
    } else {
      console.error("Unexpected API response format:", response.data);
      throw new Error("Unexpected data structure received from API");
    }
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    throw error;
  }
};

// 코인 ID로 코인 데이터 가져오기
export const fetchCoinById = async (coinId: string) => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/${coinId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 페이지별로 코인 데이터 가져오기
const fetchCoins = async () => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/page`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

// 거래소 리스트 데이터 가져오기
export const exchangeList = async () => {
  const cacheKey = "exchangeList";

  // 캐시에 해당 키의 데이터가 있으면 바로 반환합니다.
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    // 프록시 API 라우트로 요청을 보냅니다.
    const response = await fetch("/api/exchanges");
    if (!response.ok) {
      throw new Error("Failed to fetch exchanges");
    }

    const data = await response.json();

    // 데이터를 가져온 후 캐시에 저장합니다.
    cache[cacheKey] = data;

    return data;
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    throw error;
  }
};

// NFT ID로 NFT 데이터 가져오기
export const fetchNftById = async (id: string) => {
  const cacheKey = `nft-${id}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await fetchNftData(id, id);
    return response;
  } catch (error) {
    console.error(`Error fetching NFT data for ID ${id}:`, error);
    throw error;
  }
};

// API Route의 GET 메소드
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const period = searchParams.get("period") || "7d";
  const fetchTrendingCoins = searchParams.get("fetchTrendingCoins") === "true";
  const fetchGlobalMarketData =
    searchParams.get("fetchGlobalMarketData") === "true";

  try {
    if (fetchTrendingCoins) {
      const trendingCoins = await getTrendingCoins();
      return NextResponse.json(trendingCoins);
    } else if (fetchGlobalMarketData) {
      const globalMarketData = await getGlobalMarketData();
      return NextResponse.json(globalMarketData);
    } else if (coinId) {
      let days: number;
      switch (period) {
        case "1d":
          days = 1;
          break;
        case "7d":
          days = 7;
          break;
        case "30d":
          days = 30;
          break;
        case "90d":
          days = 90;
          break;
        default:
          return NextResponse.json({ error: "잘못된 기간" }, { status: 400 });
      }

      const marketData = await getCoinData(coinId, days);
      return NextResponse.json(marketData);
    } else {
      const topCoins = await getTopCoins();
      return NextResponse.json(topCoins);
    }
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
