import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import i18n from "../i18n/i18n";
import { getGlobalMarketData } from "../api/coin/route";

type UserControlsProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  user: { name: string } | null;
  handleLogin: () => void;
  handleLogout: () => void;
};

const UserControls: React.FC<UserControlsProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  user,
  handleLogin,
  handleLogout,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [marketData, setMarketData] = useState<{
    marketCapChange: number;
    btcDominance: number;
    ethDominance: number;
    activeCryptocurrencies: number;
    markets: number;
  } | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await getGlobalMarketData();

        setMarketData({
          marketCapChange: data.data.market_cap_change_percentage_24h_usd,
          btcDominance: data.data.market_cap_percentage.btc,
          ethDominance: data.data.market_cap_percentage.eth,
          activeCryptocurrencies: data.data.active_cryptocurrencies,
          markets: data.data.markets,
        });
      } catch (error) {
        console.error("Error fetching global market data:", error);
      }
    };

    fetchMarketData();
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full flex flex-col md:flex-row justify-between items-center p-4 text-white shadow-md z-50 ${
        darkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <button
          onClick={handleHomeClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300"
        >
          {t("Home", { defaultValue: "Home" })}
        </button>
        <button
          onClick={handleToggleDarkMode}
          className={`px-4 py-2 rounded-md shadow transition duration-300 ${
            darkMode
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {darkMode
            ? t("Light Mode", { defaultValue: "Light Mode" })
            : t("Dark Mode", { defaultValue: "Dark Mode" })}
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
        {marketData && (
          <div
            className={`flex flex-col md:flex-row items-center space-x-4 text-sm ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{t("Coins") + ":"}</span>
              <span className="text-blue-400">
                {marketData.activeCryptocurrencies}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{t("Exchanges") + ":"}</span>
              <span className="text-yellow-500">{marketData.markets}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{t("Market Cap Change (24h)") + ":"}</span>
              <span
                className={`${
                  marketData.marketCapChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {marketData.marketCapChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{t("BTC Dominance") + ":"}</span>
              <span className="text-yellow-500">
                {marketData.btcDominance.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{t("ETH Dominance") + ":"}</span>
              <span className="text-blue-400">
                {marketData.ethDominance.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border border-gray-300 p-2 rounded-md text-black shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="en">
            {t("English", { defaultValue: "English" })}
          </option>
          <option value="ko">{t("Korean", { defaultValue: "한국어" })}</option>
        </select>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition duration-300"
          >
            {t("Logout", { defaultValue: "Logout" })}
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition duration-300"
          >
            {t("Login", { defaultValue: "Login" })}
          </button>
        )}
      </div>
    </header>
  );
};

export default UserControls;
