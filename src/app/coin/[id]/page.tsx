"use client";

import { useState, useEffect } from "react";
import CoinChart from "../../../ui/CoinChart";
import { Coin } from "../../../ui/CoinInfo";
import UserControls from "../../components/UserControls";
import { fetchCoinById } from "../../../lib/coinApi";

type Params = {
  id: string;
};

type CoinDetailProps = {
  params: Params;
};

const CoinDetail = ({ params }: CoinDetailProps) => {
  const { id } = params;
  const [coin, setCoin] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<"1d" | "7d" | "30d">("7d");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const user = { name: "" };
  const handleLogin = () => {
    console.log("Login clicked");
  };
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/coin?coinId=${id}&period=${period}`);
        const data = await response.json();

        console.log("API 응답 데이터:", data);

        const additionalDataArray = await fetchCoinById(id);
        const additionalData = additionalDataArray[0];
        console.log("추가 데이터:", additionalData);

        if (data && data.prices && additionalData) {
          const formattedPrices = data.prices.map((item: [number, number]) => ({
            timestamp: item[0],
            price: item[1],
          }));

          const coinData: Coin = {
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
            prices: formattedPrices,
          };

          console.log("setCoin 호출 전 데이터:", coinData);
          setCoin(coinData);
        } else {
          setCoin(null);
        }
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setCoin(null);
      }
      setIsLoading(false);
    };

    fetchCoinData();
  }, [id, period]);

  const debounce = <F extends (...args: any[]) => void>(
    func: F,
    delay: number
  ): F => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    }) as F;
  };

  const handlePeriodChange = (newPeriod: "1d" | "7d" | "30d") => {
    if (newPeriod !== period) {
      setPeriod(newPeriod);
    }
  };

  const debouncedPeriodChange = debounce(handlePeriodChange, 300);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-4`}
    >
      <UserControls
        {...{
          darkMode,
          setDarkMode,
          language,
          setLanguage,
          user,
          handleLogin,
          handleLogout,
        }}
      />
      <div className="min-h-screen bg-gray-100 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-2xl">Loading...</div>
          </div>
        ) : coin ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              {coin.image && (
                <img
                  src={coin.image.thumb}
                  alt={coin.name}
                  className="w-16 h-16 mb-4"
                />
              )}
              <h1 className="text-3xl font-bold mb-2">{coin.name}</h1>
              <p className="text-lg text-gray-600 mb-4">
                {coin.symbol.toUpperCase()}
              </p>
              {coin.market_data?.current_price?.usd !== undefined && (
                <p className="text-2xl font-semibold mb-2">
                  ${coin.market_data.current_price.usd.toFixed(2)}
                </p>
              )}
              {coin.market_data?.price_change_percentage_24h !== undefined && (
                <p
                  className={`text-lg ${
                    coin.market_data.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                  (24h)
                </p>
              )}
            </div>

            {coin.prices && (
              <div className="mt-8">
                <div className="flex justify-end mb-4">
                  <button
                    className={`px-4 py-2 mr-2 ${
                      period === "1d" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => debouncedPeriodChange("1d")}
                  >
                    1일
                  </button>
                  <button
                    className={`px-4 py-2 mr-2 ${
                      period === "7d" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => debouncedPeriodChange("7d")}
                  >
                    7일
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      period === "30d"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => debouncedPeriodChange("30d")}
                  >
                    30일
                  </button>
                </div>
                <CoinChart prices={coin.prices} period={period} />
              </div>
            )}
          </div>
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
