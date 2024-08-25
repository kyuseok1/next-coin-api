import { NextRequest, NextResponse } from "next/server";
import {
  getCoinData,
  getTopCoins,
  getTrendingCoins,
  getGlobalMarketData,
} from "@/lib/coinApi";

// 메모리 캐시 설정
const cache: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const period = searchParams.get("period") || "7d"; // 기본적으로 7일로 설정
  const fetchTrendingCoins = searchParams.get("fetchTrendingCoins") === "true"; // 트렌딩 코인 데이터를 가져올지 여부
  const fetchGlobalMarketData =
    searchParams.get("fetchGlobalMarketData") === "true";

  try {
    if (fetchTrendingCoins) {
      const trendingCoins = await getTrendingCoins();

      if (!trendingCoins || !Array.isArray(trendingCoins.coins)) {
        return NextResponse.json(
          { error: "트렌딩 코인 데이터를 가져오는데 실패했습니다." },
          { status: 500 }
        );
      }

      return NextResponse.json(trendingCoins);
    } else if (fetchGlobalMarketData) {
      const globalMarketData = await getGlobalMarketData();

      if (!globalMarketData) {
        return NextResponse.json(
          { error: "글로벌 시장 데이터를 가져오는데 실패했습니다." },
          { status: 500 }
        );
      }

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

      console.log(
        `Fetching data for coinId: ${coinId} with period: ${days} days`
      );

      const marketData = await getCoinData(coinId, days);

      if (!marketData) {
        console.error(`No data found for coinId: ${coinId}`);
        return NextResponse.json(
          { error: `코인 데이터를 찾을 수 없습니다: ${coinId}` },
          { status: 404 }
        );
      }

      return NextResponse.json(marketData);
    } else {
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
