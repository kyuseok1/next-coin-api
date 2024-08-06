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
};

const FavoriteCoins: React.FC<FavoriteCoinsProps> = ({
  coins,
  favorites,
  darkMode,
  chartPeriod,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-2">{t("Favorite Coins")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav) => {
          const coin = coins.find((coin) => coin.id === fav);
          return (
            coin && (
              <Link key={coin.id} href={`/coin/${coin.id}`} passHref>
                <div
                  className={`cursor-pointer p-4 rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
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
            )
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteCoins;
