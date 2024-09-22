import { NextRequest, NextResponse } from "next/server";
import {
  fetchCryptoNews,
  getTopCoins,
  fetchNftById,
  getCoinData,
  fetchCoinDetailById,
  exchangeList,
  getGlobalMarketData,
} from "../../../app/utils/coinApi";

const setCorsHeaders = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
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
  const fetchCoinDetailByIdFlag =
    searchParams.get("fetchCoinDetailById") === "true";
  const fetchExchangeListFlag =
    searchParams.get("fetchExchangeList") === "true";
  const nftId = searchParams.get("nftId");
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
    } else if (fetchCoinDetailByIdFlag && coinId) {
      const coinDetailData = await fetchCoinDetailById(coinId);
      response = NextResponse.json(coinDetailData);
    } else if (fetchExchangeListFlag) {
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
