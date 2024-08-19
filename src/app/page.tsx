"use client";
import { useState, useEffect } from "react";
import AlertManager from "./components/AlertManager";
import CoinFilter from "./components/CoinFilter";
import CoinList from "./components/CoinList";
import FavoriteCoins from "./components/FavoriteCoins";
import NewsSection from "./components/NewsSection";
import SearchBar from "./components/SearchBar";
import UserControls from "./components/UserControls";
import { Coin } from "../ui/CoinInfo";
import { useTranslation } from "react-i18next";

type Alert = { id: string; price: number };
type NewsArticle = { title: string; url: string };

const Home = () => {
  const { t } = useTranslation();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("market_cap");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterAlerts, setFilterAlerts] = useState<string>("all");
  const [darkMode, setDarkMode] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [chartPeriod, setChartPeriod] = useState("1d");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [email, setEmail] = useState("");
  const [news, setNews] = useState<NewsArticle[]>([]);

  const fetchCoins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        filterType === "trending"
          ? "/api/coin?fetchTrendingCoins=true"
          : `/api/coin?page=${page}`
      );
      const data = await response.json();

      const formattedCoins =
        filterType === "trending"
          ? Array.isArray(data.coins)
            ? data.coins.map((coin: any) => ({
                id: coin.item.id,
                symbol: coin.item.symbol,
                name: coin.item.name,
                image: { thumb: coin.item.thumb },
                market_data: {
                  current_price: { usd: coin.item.price_btc * 1000000 },
                },
                type: "trending",
              }))
            : [] // data.coins가 배열이 아니면 빈 배열로 설정
          : Array.isArray(data)
          ? data
          : []; // data가 배열이 아니면 빈 배열로 설정

      setCoins(formattedCoins);
    } catch (error) {
      console.error("Error fetching coins data:", error);
      setError(t("Failed to fetch coin data. Please try again."));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [filterType, page]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${input}`
      );
      const data = await response.json();
      setCoins(Array.isArray(data) ? data : [data]);
      setRecentSearches((prev) =>
        Array.from(new Set([input, ...prev])).slice(0, 5)
      );
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setError(t("Failed to fetch coin data. Please try again."));
    }
    setIsLoading(false);
    console.log(handleSearch);
    console.log(input);
  };

  const handleSetAlert = () => {
    const price = parseFloat(
      prompt(t("Enter the price to set an alert for:"), "0") || "0"
    );
    if (!isNaN(price)) {
      setAlerts((prev) => [...prev, { id: input || "global", price }]);
      Notification.permission !== "granted" && Notification.requestPermission();
    }
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (alerts.length === 0 || coins.length === 0) return;

    const checkPriceAlerts = () => {
      alerts.forEach((alert, index) => {
        const matchingCoin = coins.find(
          (coin) => alert.id === "global" || alert.id === coin.id
        );

        if (matchingCoin) {
          const currentPrice = matchingCoin.market_data?.current_price?.usd;

          if (currentPrice !== undefined && currentPrice >= alert.price) {
            if (Notification.permission === "granted") {
              new Notification(
                `${matchingCoin.name} ${t("has reached")} $${alert.price}`
              );
            }
            setAlerts((prev) => prev.filter((_, i) => i !== index));
          }
        }
      });
    };

    checkPriceAlerts();
  }, [coins, alerts, t]);

  const handleLogin = () => setUser({ name: "User" });
  const handleLogout = () => setUser(null);
  const handleSubscribeAlerts = () =>
    email
      ? alert(`${t("Subscribed to alerts for")} ${email}`)
      : alert(t("Please enter a valid email address."));

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-4`}
    >
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("Crypto Coin Information")}
      </h1>
      <UserControls
        {...{
          darkMode,
          setDarkMode,
          language,
          setLanguage,
          user,
          handleLogin,
          handleLogout,
        }}
      />
      <SearchBar
        {...{
          input,
          setInput,
          handleSearch,
          handleSetAlert,
          darkMode,
          handleClearAlerts: () => setAlerts([]),
        }}
      />
      <div className="flex justify-center mb-4">
        <select
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <option value="market_cap">{t("Sort by Market Cap")}</option>
          <option value="price">{t("Sort by Price")}</option>
        </select>
      </div>
      <CoinFilter
        {...{
          filterText,
          setFilterText,
          filterType,
          setFilterType,
          priceRange,
          setPriceRange,
          darkMode,
        }}
      />
      <AlertManager
        {...{
          alerts,
          coins,
          darkMode,
          filterAlerts,
          handleDeleteAlert: (index) =>
            setAlerts((prev) => prev.filter((_, i) => i !== index)),
          setFilterAlerts,
        }}
      />
      <div className="flex justify-center mb-4">
        <select
          onChange={(e) => setChartPeriod(e.target.value)}
          value={chartPeriod}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <option value="1d">{t("1 Day")}</option>
          <option value="1w">{t("1 Week")}</option>
          <option value="1m">{t("1 Month")}</option>
        </select>
      </div>
      <div className="flex justify-center mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("Enter your email")}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        />
        <button
          onClick={handleSubscribeAlerts}
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
        >
          {t("Subscribe to Alerts")}
        </button>
      </div>
      {recentSearches.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{t("Recent Searches")}</h2>
          <div className="flex space-x-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => setInput(search)}
                className={`p-2 rounded-md ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
      <FavoriteCoins {...{ coins, favorites, darkMode, chartPeriod }} />
      <NewsSection news={news} />
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500 text-2xl">{error}</div>
        </div>
      ) : (
        <div>
          <CoinList
            {...{
              coins,
              darkMode,
              favorites,
              handleFavorite,
              chartPeriod,
              filterText,
              filterType,
              priceRange,
              sortBy,
            }}
          />
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              {t("Load More")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
