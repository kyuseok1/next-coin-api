import { NextRequest, NextResponse } from "next/server";
import { getCoinData, getTopCoins } from "@/lib/coinApi"; // 실제 데이터 API 함수 가져오기

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const period = searchParams.get("period") || "7d"; // 기간이 지정되지 않으면 기본적으로 7일로 설정

  try {
    const result = [];

    if (coinId) {
      // 기간에 따른 일수 설정
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

      // 특정 코인 데이터를 가져오기 위한 API 호출
      const coinData = await getCoinData(coinId, days);

      if (!coinData) {
        return NextResponse.json(
          { error: "코인 데이터를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      // 가격 데이터를 포함한 코인 데이터를 배열에 추가
      const prices = coinData.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        })
      );

      result.push({ ...coinData, prices });
    }

    // 상위 코인 데이터를 가져오기 위한 API 호출
    const topCoins = await getTopCoins();

    if (!topCoins || !Array.isArray(topCoins)) {
      return NextResponse.json(
        { error: "상위 코인 데이터를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 상위 코인 데이터를 형식에 맞게 변환 후 배열에 추가
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
      prices: [], // 상위 코인 데이터에는 가격 변화 정보를 포함하지 않음
    }));

    result.push(...formattedCoins);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
