import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CoinInfo, { Coin } from "../../ui/CoinInfo";
import CoinChart from "../../ui/CoinChart";

type CoinListProps = {
  coins: (Coin | string)[]; // Coin 타입 또는 string (신규 코인의 ID 배열)
  darkMode: boolean;
  favorites: string[];
  handleFavorite: (id: string) => void;
  chartPeriod: string;
  filterText: string;
  filterType: string;
  priceRange: [number, number];
  sortBy: string;
};

const CoinList: React.FC<CoinListProps> = ({
  coins,
  darkMode,
  favorites,
  handleFavorite,
  chartPeriod,
  filterText,
  filterType,
  priceRange,
  sortBy,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log("Coins data:", coins);
  }, [coins]);

  // 코인이 문자열인 경우(신규 코인의 ID만 있는 경우)를 제외하고 정렬
  const sortedCoins = [...coins]
    .filter((coin): coin is Coin => typeof coin !== "string")
    .sort((a, b) => {
      if (sortBy === "market_cap") {
        return (
          (b.market_data?.market_cap?.usd || 0) -
          (a.market_data?.market_cap?.usd || 0)
        );
      } else if (sortBy === "price") {
        return (
          (b.market_data?.current_price?.usd || 0) -
          (a.market_data?.current_price?.usd || 0)
        );
      }
      return 0;
    });

  const uniqueCoins = Array.from(new Set(sortedCoins.map((coin) => coin.id)))
    .map((id) => sortedCoins.find((coin) => coin.id === id))
    .filter((coin): coin is Coin => coin !== undefined);

  const filteredCoins = uniqueCoins.filter((coin) => {
    const matchesFilterText = coin.name
      ? coin.name.toLowerCase().includes(filterText.toLowerCase())
      : false;
    const matchesFilterType = filterType === "all" || coin.type === filterType;
    const matchesPriceRange =
      (coin.market_data?.current_price?.usd || 0) >= priceRange[0] &&
      (coin.market_data?.current_price?.usd || 0) <= priceRange[1];
    return matchesFilterText && matchesFilterType && matchesPriceRange;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coins.map((coin) => {
        // 만약 coin이 문자열(신규 코인의 ID)인 경우 처리
        if (typeof coin === "string") {
          return (
            <div key={coin} className="relative">
              <Link href={`/coin/${coin}`} passHref>
                <div
                  className={`cursor-pointer p-4 rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  }`}
                >
                  <h2>{coin}</h2> {/* 신규 코인의 ID만 표시 */}
                </div>
              </Link>
            </div>
          );
        }

        // 일반적인 코인 정보의 경우 처리
        return (
          <div key={coin.id} className="relative">
            <Link href={`/coin/${coin.id}`} passHref>
              <div
                className={`cursor-pointer p-4 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <CoinInfo coin={coin} />
                <p className="mt-2 text-sm">
                  {t("24h Change")}:{" "}
                  {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%
                </p>
                {coin.prices && (
                  <div className="mt-4">
                    <CoinChart prices={coin.prices} period={chartPeriod} />
                  </div>
                )}
              </div>
            </Link>
            <button
              onClick={() => handleFavorite(coin.id)}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                favorites.includes(coin.id) ? "bg-yellow-500" : "bg-gray-300"
              }`}
            >
              ★
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CoinList;
