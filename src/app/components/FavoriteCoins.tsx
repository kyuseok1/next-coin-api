import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CoinInfo, { Coin } from "../../ui/CoinInfo";
import CoinChart from "../../ui/CoinChart";

type FavoriteCoinsProps = {
  coins: Coin[];
  favorites: string[];
  darkMode: boolean;
  chartPeriod: string;
  handleFavorite: (id: string) => void;
};

const FavoriteCoins: React.FC<FavoriteCoinsProps> = ({
  coins,
  favorites,
  darkMode,
  chartPeriod,
  handleFavorite,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{t("Favorite Coins")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav) => {
          const coin = coins.find((coin) => coin.id === fav);
          return (
            coin && (
              <div key={coin.id} className="relative group">
                <Link href={`/coin/${coin.id}`} passHref>
                  <div
                    className={`cursor-pointer p-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out group-hover:scale-105 ${
                      darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <CoinInfo coin={coin} />
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
            )
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteCoins;
