import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// 메모리 캐시 설정
const cache: { [key: string]: any } = {};

// 특정 기간 동안의 코인 가격 데이터를 가져오는 함수
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
          days: days, // 요청할 기간을 설정 (예: 1, 7, 30, 90)
        },
      }
    );

    const data = response.data;
    cache[cacheKey] = data; // 캐시 저장
    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    throw error;
  }
};

// 상위 코인 데이터를 가져오는 함수
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
        per_page: 100, // 100개의 코인 데이터를 가져옴
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

// 트렌딩 코인 데이터를 가져오는 함수
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

// 글로벌 시장 데이터를 가져오는 함수
export const getGlobalMarketData = async () => {
  const cacheKey = "globalMarketData";

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`);

    const data = response.data;
    cache[cacheKey] = data; // 캐시 저장
    return data;
  } catch (error) {
    console.error("Error fetching global market data:", error);
    throw error;
  }
};

// GET 요청을 처리하는 핸들러
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const period = searchParams.get("period") || "7d"; // 기간이 지정되지 않으면 기본적으로 7일로 설정
  const fetchTrendingCoins = searchParams.get("fetchTrendingCoins") === "true"; // 트렌딩 코인 데이터를 가져올지 여부
  const fetchGlobalMarketData =
    searchParams.get("fetchGlobalMarketData") === "true"; // 글로벌 시장 데이터를 가져올지 여부

  try {
    if (fetchTrendingCoins) {
      // 트렌딩 코인 데이터를 가져오는 경우
      const trendingCoins = await getTrendingCoins();

      if (!trendingCoins || !Array.isArray(trendingCoins.coins)) {
        return NextResponse.json(
          { error: "트렌딩 코인 데이터를 가져오는데 실패했습니다." },
          { status: 500 }
        );
      }

      // 트렌딩 코인 데이터를 응답으로 반환
      return NextResponse.json(trendingCoins);
    } else if (fetchGlobalMarketData) {
      // 글로벌 시장 데이터를 가져오는 경우
      const globalMarketData = await getGlobalMarketData();

      if (!globalMarketData) {
        return NextResponse.json(
          { error: "글로벌 시장 데이터를 가져오는데 실패했습니다." },
          { status: 500 }
        );
      }

      // 글로벌 시장 데이터를 응답으로 반환
      return NextResponse.json(globalMarketData);
    } else if (coinId) {
      let days: number;
      // 기간을 숫자로 변환
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

      // 선택한 기간의 데이터를 가져오기 위한 API 호출
      const marketData = await getCoinData(coinId, days);

      if (!marketData) {
        return NextResponse.json(
          { error: "코인 데이터를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      return NextResponse.json(marketData);
    } else {
      // 상위 코인 데이터를 가져오기 위한 API 호출
      const topCoins = await getTopCoins();

      if (!topCoins || !Array.isArray(topCoins)) {
        return NextResponse.json(
          { error: "상위 코인 데이터를 가져오는데 실패했습니다." },
          { status: 500 }
        );
      }

      const formattedCoins = topCoins.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: {
          thumb: coin.image,
        },
        market_data: {
          current_price: {
            usd: coin.current_price,
          },
          market_cap: {
            usd: coin.market_cap,
          },
          price_change_percentage_24h: coin.price_change_percentage_24h,
        },
      }));

      return NextResponse.json(formattedCoins);
    }
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
