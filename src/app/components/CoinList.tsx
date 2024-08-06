import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CoinInfo, { Coin } from "../../ui/CoinInfo";
import CoinChart from "../../ui/CoinChart";

type CoinListProps = {
  coins: Coin[];
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

  const sortedCoins = [...coins].sort((a, b) => {
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
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesFilterType = filterType === "all" || coin.type === filterType;
    const matchesPriceRange =
      (coin.market_data?.current_price?.usd || 0) >= priceRange[0] &&
      (coin.market_data?.current_price?.usd || 0) <= priceRange[1];
    return matchesFilterText && matchesFilterType && matchesPriceRange;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCoins.map((coin) => (
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
      ))}
    </div>
  );
};

export default CoinList;
