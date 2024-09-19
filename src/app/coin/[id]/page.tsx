"use client";
import { useState, useEffect, useCallback } from "react";
import CoinChart from "../../../ui/CoinChart";
import { Coin } from "../../../ui/CoinInfo";
import { getCoinData } from "../../api/coin/route";

type Params = { id: string };
type AdditionalData = {
  market_cap_rank: number;
  hashing_algorithm: string;
  genesis_date: string;
  developer_data: { stars: number; forks: number; total_issues: number };
  description: { en: string };
  links: { homepage: string[]; whitepaper: string };
};

type CoinDetailProps = { params: Params };

const CoinDetail = ({ params }: CoinDetailProps) => {
  const { id } = params;
  const [coin, setCoin] = useState<
    (Coin & { additional?: AdditionalData }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"1d" | "7d" | "30d">("7d");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchCoinDetailData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await getCoinData(id, period);
      console.log("fetchCoinData에서 받은 결과:", result);

      const prices = result.prices.map(
        (item: { timestamp: number; price: number }) => ({
          timestamp: item.timestamp,
          price: item.price,
        })
      );

      const coinData: Coin = {
        id,
        symbol: result.symbol || "",
        name: result.name || "",
        image: result.image || "",
        market_data: {
          current_price: {
            usd: result.market_data?.current_price?.usd || 0,
          },
          market_cap: {
            usd: result.market_data?.market_cap?.usd || 0,
          },
          price_change_percentage_24h:
            result.market_data?.price_change_percentage_24h || 0,
        },
        prices: prices,
        additional: result.additional,
        current_price: undefined,
        price_change_percentage_24h: undefined,
        market_cap: undefined,
        market_cap_rank: 0,
        high_24h: 0,
        low_24h: 0,
        max_supply: 0,
        circulating_supply: 0,
      };

      setCoin(coinData);
    } catch (error) {
      console.error("코인 데이터를 가져오는 중 오류 발생:", error);
      setCoin(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoinDetailData();
  }, [id, period]);

  const debounce = useCallback(
    <F extends (...args: any[]) => void>(func: F, delay: number): F => {
      let timeoutId: NodeJS.Timeout;
      return ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      }) as F;
    },
    []
  );

  const renderDescription = () => {
    const description = coin?.additional?.description?.en || "설명이 없습니다.";
    return description.length > 300 ? (
      <>
        {showFullDescription ? description : `${description.slice(0, 300)}...`}
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-blue-500 underline ml-2 text-sm"
        >
          {showFullDescription ? "간략히 보기" : "더 보기"}
        </button>
      </>
    ) : (
      description
    );
  };

  const renderDetail = (title: string, value: string | number | undefined) => (
    <p className="mb-2">
      <strong>{title}:</strong> {value}
    </p>
  );

  const renderLink = (title: string, url: string) => (
    <p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {title}
      </a>
    </p>
  );

  return (
    <div className={`min-h-screen p-6 `}>
      <div className={`max-w-4xl mx-auto p-8 rounded-lg shadow-lg mt-4`}>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl">로딩 중...</div>
          </div>
        ) : coin ? (
          <>
            <div className="flex items-center justify-center text-sm mt-10 mb-6">
              {coin.image && (
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-10 h-10 mr-4 rounded-full shadow-lg"
                />
              )}
              <div className="text-center">
                <h1 className={`text-base font-bold mb-1`}>{coin.name}</h1>
                <p className={`text-lg mb-2`}>{coin.symbol.toUpperCase()}</p>
                <p className={`text-xl font-semibold`}>
                  ${coin.market_data?.current_price?.usd?.toFixed(2)}
                </p>
                {coin.market_data?.price_change_percentage_24h !==
                  undefined && (
                  <p
                    className={`text-md font-medium ${
                      coin.market_data.price_change_percentage_24h >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    } mt-1`}
                  >
                    {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                    (24h)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-6">
              <div className={`p-4 rounded-lg shadow-md `}>
                <h2 className="text-2xl font-bold mb-4">상세정보</h2>
                {renderDetail(
                  "Market Cap Rank",
                  coin.additional?.market_cap_rank
                )}
                {renderDetail(
                  "Hashing Algorithm",
                  coin.additional?.hashing_algorithm
                )}
                {renderDetail("Genesis Date", coin.additional?.genesis_date)}
                {renderDetail("Stars", coin.additional?.developer_data.stars)}
                {renderDetail("Forks", coin.additional?.developer_data.forks)}
                {renderDetail(
                  "Issues",
                  coin.additional?.developer_data.total_issues
                )}
              </div>
              <div className={`p-4 rounded-lg shadow-md`}>
                <h2 className="text-2xl font-bold mb-4">설명</h2>
                <p className="text-gray-700">{renderDescription()}</p>
              </div>
              <div className={`p-4 rounded-lg shadow-md`}>
                <h2 className="text-2xl font-bold mb-4">링크</h2>
                {coin.additional && (
                  <>
                    {renderLink("Homepage", coin.additional.links.homepage[0])}
                    {renderLink("Whitepaper", coin.additional.links.whitepaper)}
                  </>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-center mb-6 space-x-2">
                {["1d", "7d", "30d"].map((p) => (
                  <button
                    key={p}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm ${
                      period === p
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() =>
                      debounce(setPeriod, 300)(p as "1d" | "7d" | "30d")
                    }
                  >
                    {p === "1d" ? "1일" : p === "7d" ? "7일" : "30일"}
                  </button>
                ))}
              </div>
              <CoinChart prices={coin.prices || []} period={period} />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl">코인을 찾을 수 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
