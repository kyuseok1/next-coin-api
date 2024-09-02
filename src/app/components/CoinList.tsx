import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CoinInfo, { Coin } from "../../ui/CoinInfo";

import { getTrendingCoins } from "../../lib/coinApi";

type CoinListProps = {
  coins: (Coin | string)[];
  darkMode: boolean;
  favorites: string[];
  handleFavorite: (id: string) => void;
  chartPeriod: string;
  filterText: string;
  filterType: string;
  priceRange: [number, number];
};

type SortBy = {
  key: "price" | "24h" | "market_cap";
  order: "asc" | "desc";
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
}) => {
  const { t } = useTranslation();
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>({ key: "price", order: "desc" });

  useEffect(() => {
    if (filterType === "trending") {
      getTrendingCoins()
        .then((trendingData) => {
          setTrendingCoins(Array.isArray(trendingData) ? trendingData : []);
        })
        .catch(() => {
          setTrendingCoins([]);
        });
    } else {
      setTrendingCoins([]);
    }
  }, [filterType]);

  const handleSort = (key: "price" | "24h" | "market_cap") => {
    setSortBy((prevSortBy) => ({
      key,
      order:
        prevSortBy.key === key && prevSortBy.order === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedCoins = useMemo(() => {
    const coinArray: Coin[] = [...coins, ...trendingCoins].filter(
      (coin): coin is Coin => typeof coin !== "string"
    );

    const filteredCoins = coinArray.filter((coin) => {
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

    return filteredCoins.sort((a, b) => {
      if (sortBy.key === "price") {
        return sortBy.order === "asc"
          ? (a.market_data?.current_price?.usd ?? -1) -
              (b.market_data?.current_price?.usd ?? -1)
          : (b.market_data?.current_price?.usd ?? -1) -
              (a.market_data?.current_price?.usd ?? -1);
      } else if (sortBy.key === "24h") {
        return sortBy.order === "asc"
          ? (a.market_data?.price_change_percentage_24h ?? -1) -
              (b.market_data?.price_change_percentage_24h ?? -1)
          : (b.market_data?.price_change_percentage_24h ?? -1) -
              (a.market_data?.price_change_percentage_24h ?? -1);
      } else if (sortBy.key === "market_cap") {
        return sortBy.order === "asc"
          ? (a.market_data?.market_cap?.usd ?? -1) -
              (b.market_data?.market_cap?.usd ?? -1)
          : (b.market_data?.market_cap?.usd ?? -1) -
              (a.market_data?.market_cap?.usd ?? -1);
      }
      return 0;
    });
  }, [coins, trendingCoins, filterText, filterType, priceRange, sortBy]);

  const uniqueCoins = useMemo(
    () =>
      Array.from(new Set(filteredAndSortedCoins.map((coin) => coin.id))).map(
        (id) => filteredAndSortedCoins.find((coin) => coin.id === id)!
      ),
    [filteredAndSortedCoins]
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center">
        <thead className="">
          <tr>
            <th className="py-3 px-6 text-sm font-semibold ">#</th>
            <th className="py-3 px-6 text-sm font-semibold  text-left">
              {t("Coin")}
            </th>
            <th className="py-3 px-6 text-sm font-semibold ">
              <div className="flex items-center justify-center space-x-1">
                <span>{t("Price")}</span>
                <button
                  onClick={() => handleSort("price")}
                  className="p-1 rounded  text-black hover:bg-blue-600 transition duration-300"
                >
                  {sortBy.key === "price" && sortBy.order === "asc" ? "▲" : "▼"}
                </button>
              </div>
            </th>
            <th className="py-3 px-6 text-sm font-semibold ">
              <div className="flex items-center justify-center space-x-1">
                <span>24h</span>
                <button
                  onClick={() => handleSort("24h")}
                  className="p-1 rounded text-black hover:bg-blue-600 transition duration-300"
                >
                  {sortBy.key === "24h" && sortBy.order === "asc" ? "▲" : "▼"}
                </button>
              </div>
            </th>
            <th className="py-3 px-6 text-sm font-semibold ">
              <div className="flex items-center justify-center space-x-1">
                <span>{t("Market Cap")}</span>
                <button
                  onClick={() => handleSort("market_cap")}
                  className="p-1 rounded text-black hover:bg-blue-600 transition duration-300"
                >
                  {sortBy.key === "market_cap" && sortBy.order === "asc"
                    ? "▲"
                    : "▼"}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {uniqueCoins.map((coin, index) => (
            <tr
              key={coin.id}
              className="border-b dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <td className="py-3 px-6">{index + 1}</td>
              <td className="py-3 px-6">
                <Link href={`/coin/${coin.id}`}>
                  <div className={`flex items-center space-x-3 `}>
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
