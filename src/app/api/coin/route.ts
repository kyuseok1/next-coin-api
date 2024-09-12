import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// 캐시 유효 기간 5분 설정
const cacheExpiration = 1000 * 60 * 5; // 5분
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
      return fetchWithBackoff(url, retries - 1, delay * 2); // 지연 시간 증가
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

export const getCoinData = async (
  coinId: string,
  period: "1d" | "7d" | "30d"
) => {
  try {
    const vsCurrency = "usd";
    let days = "1";

    if (period === "7d") {
      days = "7";
    } else if (period === "30d") {
      days = "30";
    }

    // 가격 차트 데이터 가져오기
    const marketChartResponse = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`
    );
    if (!marketChartResponse.ok) {
      throw new Error(
        `가격 데이터를 가져오는 중 오류 발생: ${marketChartResponse.status}`
      );
    }
    const marketChartData = await marketChartResponse.json();

    // 코인 상세 정보 가져오기
    const detailResponse = await fetch(`${COINGECKO_API_URL}/coins/${coinId}`);
    if (!detailResponse.ok) {
      throw new Error(
        `상세 정보를 가져오는 중 오류 발생: ${detailResponse.status}`
      );
    }
    const detailData = await detailResponse.json();

    const prices = marketChartData.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1],
    }));

    return {
      prices,
      symbol: detailData.symbol,
      name: detailData.name,
      image: detailData.image.large,
      market_data: detailData.market_data,
      additional: {
        market_cap_rank: detailData.market_cap_rank,
        hashing_algorithm: detailData.hashing_algorithm,
        genesis_date: detailData.genesis_date,
        developer_data: detailData.developer_data,
        description: detailData.description,
        links: detailData.links,
      },
    };
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
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
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("상위 코인 데이터를 가져오는 중 오류 발생:", error);
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
    cache[cacheKey] = data;
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

export const fetchCoinById = async (coinId: string) => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/${coinId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

export const fetchCoinData = async (
  coinId: string,
  period: "1d" | "7d" | "30d"
) => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${period}`
    );

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const data = await response.json();
    console.log("받은 데이터:", data);
    return data;
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

const fetchCoins = async () => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/page`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

export const exchangeList = async () => {
  const cacheKey = "exchangeList";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await fetch("/api/exchanges");
    if (!response.ok) {
      throw new Error("Failed to fetch exchanges");
    }

    const data = await response.json();
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    throw error;
  }
};

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
  const fetchCoinByIdFlag = searchParams.get("fetchCoinById") === "true";
  const fetchCoinsFlag = searchParams.get("fetchCoins") === "true";

  try {
    if (fetchTrendingCoins) {
      const trendingCoins = await getTrendingCoins();
      return NextResponse.json(trendingCoins);
    } else if (fetchGlobalMarketData) {
      const globalMarketData = await getGlobalMarketData();
      return NextResponse.json(globalMarketData);
    } else if (fetchCoinByIdFlag && coinId) {
      const coinData = await fetchCoinById(coinId);
      return NextResponse.json(coinData);
    } else if (fetchCoinsFlag) {
      const coinsData = await fetchCoins();
      return NextResponse.json(coinsData);
    } else if (coinId) {
      // period를 문자열 리터럴 타입으로 변환
      let days: "1d" | "7d" | "30d";

      switch (period) {
        case "1d":
        case "7d":
        case "30d":
          days = period;
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
