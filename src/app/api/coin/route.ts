import { NextRequest, NextResponse } from "next/server";
import { getCoinData, getTopCoins } from "../../../lib/coinApi";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");

  console.log("API called with coinId:", coinId);

  if (coinId) {
    try {
      const coinData = await getCoinData(coinId);

      const prices = [
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
          price: coinData.market_data.current_price.usd * 0.9,
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
          price: coinData.market_data.current_price.usd * 0.85,
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
          price: coinData.market_data.current_price.usd * 0.92,
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
          price: coinData.market_data.current_price.usd * 0.88,
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
          price: coinData.market_data.current_price.usd * 0.95,
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
          price: coinData.market_data.current_price.usd * 1.1,
        },
        {
          timestamp: Date.now() - 1000 * 60 * 60 * 24,
          price: coinData.market_data.current_price.usd * 1.05,
        },
        {
          timestamp: Date.now(),
          price: coinData.market_data.current_price.usd,
        },
      ];

      return NextResponse.json({ ...coinData, prices });
    } catch (error) {
      console.error("Failed to fetch coin data:", error);
      return NextResponse.json(
        { error: "Failed to fetch coin data" },
        { status: 500 }
      );
    }
  } else {
    try {
      const topCoins = await getTopCoins();
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
    } catch (error) {
      console.error("Failed to fetch top coins data:", error);
      return NextResponse.json(
        { error: "Failed to fetch top coins data" },
        { status: 500 }
      );
    }
  }
}
