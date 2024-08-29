"use client";

import { useState, useEffect, useCallback } from "react";
import CoinChart from "../../../ui/CoinChart";
import { Coin } from "../../../ui/CoinInfo";
import UserControls from "../../components/UserControls";
import { fetchCoinById } from "../../../lib/coinApi";

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
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태를 true로 설정
  const [period, setPeriod] = useState<"1d" | "7d" | "30d">("7d");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const user = { name: "" };

  const fetchCoinData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [data, additionalDataArray] = await Promise.all([
        fetch(`/api/coin?coinId=${id}&period=${period}`).then((res) =>
          res.json()
        ),
        fetchCoinById(id),
      ]);

      console.log("Fetched data:", data);
      console.log("Additional data:", additionalDataArray);

      const additionalData = additionalDataArray[0];
      if (data && data.prices && additionalData) {
        const coinData = {
          id: data.id || additionalData.id || "",
          symbol: data.symbol || additionalData.symbol || "",
          name: data.name || additionalData.name || "",
          image: {
            thumb: data.image?.thumb || additionalData.image?.thumb || "",
          },
          market_data: {
            current_price: {
              usd:
                data.market_data?.current_price?.usd ||
                additionalData.market_data?.current_price?.usd ||
                0,
            },
            market_cap: {
              usd:
                data.market_data?.market_cap?.usd ||
                additionalData.market_data?.market_cap?.usd ||
                0,
            },
            price_change_percentage_24h:
              data.market_data?.price_change_percentage_24h ||
              additionalData.market_data?.price_change_percentage_24h ||
              0,
          },
          prices: data.prices.map((item: [number, number]) => ({
            timestamp: item[0],
            price: item[1],
          })),
          additional: additionalData,
        };

        console.log("Processed coin data:", coinData);

        setCoin(coinData);
      } else {
        setCoin(null);
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setCoin(null);
    }
    setIsLoading(false); // 데이터 페칭 완료 후 로딩 상태 false로 설정
  };

  useEffect(() => {
    fetchCoinData();
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
    const description =
      coin?.additional?.description?.en || "No description available.";
    return description.length > 300 ? (
      <>
        {showFullDescription ? description : `${description.slice(0, 300)}...`}
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-blue-500 underline ml-2 text-sm"
        >
          {showFullDescription ? "Show Less" : "Show More"}
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
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-6`}
    >
      <UserControls
        handleLogin={() => console.log("Login")}
        handleLogout={() => console.log("Logout")}
        {...{ darkMode, setDarkMode, language, setLanguage, user }}
      />
      <div
        className={`max-w-4xl mx-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded-lg shadow-lg mt-4`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl">Loading...</div>
          </div>
        ) : coin ? (
          <>
            <div className="flex items-center justify-center text-sm mb-6">
              {coin.image && (
                <img
                  src={coin.image.thumb}
                  alt={coin.name}
                  className="w-10 h-10 mr-4 rounded-full shadow-lg"
                />
              )}
              <div className="text-center">
                <h1
                  className={`text-base font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  } mb-1`}
                >
                  {coin.name}
                </h1>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  } mb-2`}
                >
                  {coin.symbol.toUpperCase()}
                </p>
                <p
                  className={`text-xl font-semibold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
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
              <div
                className={`p-4 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h2 className="text-2xl font-bold mb-4">Details</h2>
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
              <div
                className={`p-4 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700">{renderDescription()}</p>
              </div>
              <div
                className={`p-4 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h2 className="text-2xl font-bold mb-4">Links</h2>
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
