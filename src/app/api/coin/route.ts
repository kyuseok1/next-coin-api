import { NextRequest, NextResponse } from "next/server";
import { getCoinData, getTopCoins, getNewCoins } from "@/lib/coinApi"; // 실제 데이터 API 함수 가져오기

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const period = searchParams.get("period") || "7d"; // 기간이 지정되지 않으면 기본적으로 7일로 설정
  const isNew = searchParams.get("new") === "true"; // 신규 코인 데이터를 가져올지 여부

  try {
    if (isNew) {
      // 신규 코인 데이터를 가져오기 위한 API 호출
      const newCoins = await getNewCoins();

      if (!newCoins || !Array.isArray(newCoins)) {
        return NextResponse.json(
          { error: "신규 코인 데이터를 가져오는데 실패했습니다." },
          { status: 500 }
        );
      }

      // id만 추출하여 새로운 배열로 변환
      const ids = newCoins.map((coin: any) => coin.id);

      return NextResponse.json(ids); // id 배열만 반환
    } else if (coinId) {
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

      // 실제 데이터를 가져오기 위한 API 호출
      const coinData = await getCoinData(coinId, days);

      if (!coinData) {
        return NextResponse.json(
          { error: "코인 데이터를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      // 가격 데이터를 응답에 포함시킴
      const prices = coinData.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        })
      );

      return NextResponse.json({ ...coinData, prices });
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
