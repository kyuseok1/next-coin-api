import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Coin } from "../../ui/CoinInfo"; // Coin 타입 가져오기

type CoinListProps = {
  coins: Coin[];
  darkMode: boolean;
  favorites: string[];
  handleFavorite: (id: string) => void;
  chartPeriod: string;
  filterText: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 한 페이지당 보여줄 코인의 개수

  // 정렬된 코인 목록을 계산
  const sortedCoins = useMemo(() => {
    const sorted = [...coins].sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (sortBy.key === "price") {
        aValue = a.current_price || 0;
        bValue = b.current_price || 0;
      } else if (sortBy.key === "24h") {
        aValue = a.price_change_percentage_24h || 0;
        bValue = b.price_change_percentage_24h || 0;
      } else if (sortBy.key === "market_cap") {
        aValue = a.market_cap || 0;
        bValue = b.market_cap || 0;
      }

      if (sortBy.order === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [coins, sortBy]);

  // 페이지에 맞는 코인 데이터 가져오기
  const paginatedCoins = sortedCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 수 계산
  const totalPages = Math.ceil(coins.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

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
          {paginatedCoins.map((coin, index) => (
            <tr
              key={coin.id}
              className="border-b dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <td className="py-3 px-6">
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </td>
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

      {/* 페이지네이션 컨트롤 */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:bg-gray-400"
        >
          {t("이전")}
        </button>
        <span className="flex items-center">
          {t("페이지")} {currentPage} {t("of")} {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:bg-gray-400"
        >
          {t("다음")}
        </button>
      </div>
    </div>
  );
};

export default CoinList;
