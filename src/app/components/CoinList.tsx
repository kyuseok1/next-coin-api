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
        .then((response) => {
          const trendingData = response.data.coins.map((coin: any) => ({
            id: coin.item.id,
            symbol: coin.item.symbol,
            name: coin.item.name,
            image: { thumb: coin.item.thumb },
            market_data: {
              current_price: { usd: coin.item.price_btc * 50000 },
              market_cap: { usd: 0 },
              price_change_percentage_24h: 0,
            },
          }));
          setTrendingCoins(trendingData);
        })
        .catch(console.error);
    }
  }, [filterType]);

  const filterAndSortCoins = (coinList: Coin[]) => {
    const filteredCoins = coinList.filter((coin) => {
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
    });

    const sortedCoins = filteredCoins.sort((a, b) => {
      const priceA = a.market_data?.current_price?.usd ?? -1;
      const priceB = b.market_data?.current_price?.usd ?? -1;
      const marketCapA = a.market_data?.market_cap?.usd ?? -1;
      const marketCapB = b.market_data?.market_cap?.usd ?? -1;

      if (sortBy === "market_cap") {
        return marketCapB - marketCapA;
      } else if (sortBy === "price") {
        return priceB - priceA;
      }

      return 0;
    });

    return sortedCoins;
  };

  const coinArray: Coin[] = [...coins, ...trendingCoins].filter(
    (coin): coin is Coin => typeof coin !== "string"
  );

  const sortedAndFilteredCoins = filterAndSortCoins(coinArray);

  const uniqueCoins = Array.from(
    new Set(sortedAndFilteredCoins.map((coin) => coin.id))
  ).map((id) => sortedAndFilteredCoins.find((coin) => coin.id === id)!);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center ">
        <thead>
          <tr>
            <th className="py-3 px-6 bg-gray-100">#</th>
            <th className="py-3 px-6 bg-gray-100 0">{t("Coin")}</th>
            <th className="py-3 px-6 bg-gray-100 ">{t("Price")}</th>
            <th className="py-3 px-6 bg-gray-100">24h</th>
            <th className="py-3 px-6 bg-gray-100 ">{t("Market Cap")}</th>
            <th className="py-3 px-6 bg-gray-100">{t("Last 7 Days")}</th>
          </tr>
        </thead>
        <tbody>
          {uniqueCoins.map((coin, index) => (
            <tr
              key={coin.id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-6">{index + 1}</td>
              <td className="py-3 px-6">
                <Link href={`/coin/${coin.id}`}>
                  <div
                    className={`flex items-center space-x-3 ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <img
                      src={coin.image?.thumb}
                      alt={coin.name}
                      className="w-6 h-6"
                    />
                    <span>{coin.name}</span>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-6">
                {coin.market_data?.current_price?.usd?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className="py-3 px-6">
                {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className="py-3 px-6">
                {coin.market_data?.market_cap?.usd?.toLocaleString()}
              </td>
              <td className="py-3 px-6">
                {/* prices가 undefined일 경우 빈 배열로 대체 */}
                <CoinChart prices={coin.prices ?? []} period={chartPeriod} />
              </td>
              <td className="py-3 px-6">
                <button
                  onClick={() => handleFavorite(coin.id)}
                  className={`p-2 rounded-full transition duration-300 ${
                    favorites.includes(coin.id)
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                  } hover:bg-yellow-600`}
                >
                  ★
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinList;
