import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CoinInfo, { Coin } from "../../ui/CoinInfo";
import CoinChart from "../../ui/CoinChart";
import axios from "axios";

type CoinListProps = {
  coins: (Coin | string)[];
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
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (filterType === "trending") {
      axios
        .get("https://api.coingecko.com/api/v3/search/trending")
        .then((response) =>
          setTrendingCoins(
            response.data.coins.map((coin: any) => ({
              id: coin.item.id,
              symbol: coin.item.symbol,
              name: coin.item.name,
              image: { thumb: coin.item.thumb },
              market_data: {
                current_price: { usd: coin.item.price_btc * 50000 },
                market_cap: { usd: 0 },
                price_change_percentage_24h: 0,
              },
            }))
          )
        )
        .catch(console.error);
    }
  }, [filterType]);

  const filterAndSortCoins = (coinList: Coin[]) =>
    coinList
      .filter((coin) => {
        const matchesFilterText = coin.name
          ?.toLowerCase()
          .includes(filterText.toLowerCase());
        const matchesFilterType =
          filterType === "all" ||
          filterType === "trending" ||
          coin.type === filterType;
        const matchesPriceRange =
          (coin.market_data?.current_price?.usd || 0) >= priceRange[0] &&
          (coin.market_data?.current_price?.usd || 0) <= priceRange[1];
        return matchesFilterText && matchesFilterType && matchesPriceRange;
      })
      .sort((a, b) => {
        const valueA =
          sortBy === "market_cap"
            ? b.market_data?.market_cap?.usd
            : b.market_data?.current_price?.usd;
        const valueB =
          sortBy === "market_cap"
            ? a.market_data?.market_cap?.usd
            : a.market_data?.current_price?.usd;
        return (valueA || 0) - (valueB || 0);
      });

  const coinArray: Coin[] = [...coins, ...trendingCoins].filter(
    (coin): coin is Coin => typeof coin !== "string"
  );

  const uniqueCoins = Array.from(new Set(coinArray.map((coin) => coin.id))).map(
    (id) => coinArray.find((coin) => coin.id === id)!
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueCoins.map((coin) => (
        <div key={coin.id} className="relative group">
          <Link href={`/coin/${coin.id}`} passHref>
            <div
              className={`cursor-pointer p-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out group-hover:scale-105 ${
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
            className={`absolute top-4 right-4 p-2 rounded-full transition duration-300 ${
              favorites.includes(coin.id)
                ? "bg-yellow-500 text-white"
                : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
            } hover:bg-yellow-600`}
          >
            ★
          </button>
        </div>
      ))}
    </div>
  );
};

export default CoinList;
