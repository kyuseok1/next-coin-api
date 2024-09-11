import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Coin } from "../../ui/CoinInfo";

type CoinListProps = {
  coins: Coin[];
  darkMode: boolean;
  favorites: string[];
  handleFavorite: (id: string) => void;
  sortBy: {
    key: "price" | "24h" | "market_cap";
    order: "asc" | "desc";
  };
  handleSort: (key: "price" | "24h" | "market_cap") => void;
};

const CoinList: React.FC<CoinListProps> = ({
  coins,
  darkMode,
  favorites,
  handleFavorite,
  sortBy,
  handleSort,
}) => {
  const { t } = useTranslation();

  // 디버깅용 로그
  useEffect(() => {
    console.log("Coins data:", coins);
  }, [coins]);

  // 데이터가 없는 경우 메시지 표시
  if (!coins || coins.length === 0) {
    return <p>{t("코인 데이터가 없습니다.")}</p>;
  }

  return (
    <div
      className={`overflow-x-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <table className="min-w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="py-3 px-6 text-sm font-semibold">#</th>
            <th className="py-3 px-6 text-sm font-semibold text-left">
              {t("코인")}
            </th>
            <th className="py-3 px-6 text-sm font-semibold">
              <div className="flex items-center justify-center space-x-1">
                <span>{t("가격")}</span>
                <button
                  onClick={() => handleSort("price")}
                  className="p-1 rounded text-black hover:bg-blue-600 transition duration-300"
                >
                  {sortBy.key === "price" && sortBy.order === "asc" ? "▲" : "▼"}
                </button>
              </div>
            </th>
            <th className="py-3 px-6 text-sm font-semibold">
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
            <th className="py-3 px-6 text-sm font-semibold">
              <div className="flex items-center justify-center space-x-1">
                <span>{t("시가총액")}</span>
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
          {coins.map((coin, index) => (
            <tr
              key={coin.id}
              className="border-b dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <td className="py-3 px-6">{index + 1}</td>
              <td className="py-3 px-6">
                <Link href={`/coin/${coin.id}`}>
                  <div className="flex items-center space-x-3">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                    <span>{coin.name}</span>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-6">
                {coin.current_price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className="py-3 px-6">
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className="py-3 px-6">{coin.market_cap?.toLocaleString()}</td>
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
