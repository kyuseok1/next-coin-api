import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import i18n from "../i18n/i18n";

// 서버 API를 통해 글로벌 마켓 데이터를 가져오는 함수
const fetchGlobalMarketData = async () => {
  const response = await fetch("/api/coin?fetchGlobalMarketData=true");
  if (!response.ok) {
    throw new Error("Failed to fetch global market data");
  }
  return response.json();
};

type MarketData = {
  marketCapChange: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  markets: number;
};

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
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    const now = Date.now();
    const fetchMarketData = async () => {
      try {
        // 데이터가 5분 이내에 캐시된 경우 요청하지 않음
        if (now - lastFetchTime < 5 * 60 * 1000 && marketData) {
          return;
        }

        const response = await fetchGlobalMarketData();
        console.log("Fetched Global Market Data:", response); // 데이터를 콘솔에 출력

        // 'response.data'에 접근하여 필요한 데이터를 가져옴
        const data = response.data;

        setMarketData({
          marketCapChange: data.market_cap_change_percentage_24h_usd,
          btcDominance: data.market_cap_percentage.btc,
          ethDominance: data.market_cap_percentage.eth,
          activeCryptocurrencies: data.active_cryptocurrencies,
          markets: data.markets,
        });

        setLastFetchTime(now);
      } catch (error) {
        console.error("Error fetching global market data:", error);
      }
    };

    fetchMarketData();
  }, [lastFetchTime, marketData]);

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

  const MarketDataDisplay = React.memo(
    ({ marketData }: { marketData: MarketData }) => {
      const formattedMarketData = useMemo(
        () => ({
          marketCapChange: marketData.marketCapChange.toFixed(2),
          btcDominance: marketData.btcDominance.toFixed(2),
          ethDominance: marketData.ethDominance.toFixed(2),
        }),
        [marketData]
      );

      return (
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
              {formattedMarketData.marketCapChange}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{t("BTC Dominance") + ":"}</span>
            <span className="text-yellow-500">
              {formattedMarketData.btcDominance}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{t("ETH Dominance") + ":"}</span>
            <span className="text-blue-400">
              {formattedMarketData.ethDominance}%
            </span>
          </div>
        </div>
      );
    }
  );

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
        {marketData && <MarketDataDisplay marketData={marketData} />}
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
