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
import i18n from "./i18n/i18n";
type Alert = {
  id: string;
  price: number;
};

type NewsArticle = {
  title: string;
  url: string;
};

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

  useEffect(() => {
    const fetchTopCoins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/coin?page=${page}`);
        const data = await response.json();
        setCoins((prevCoins) => [...prevCoins, ...data]);
      } catch (error) {
        console.error("Error fetching top coins data:", error);
        setError("Failed to fetch coin data. Please try again.");
      }
      setIsLoading(false);
    };

    fetchTopCoins();
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage(1); // 페이지 1로 리셋
    }, 60000); // 60초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/coin?coinId=${input}`);
      const data = await response.json();
      setCoins([data]);
      setRecentSearches((prev) => {
        const newSearches = [input, ...prev];
        const uniqueSearches = Array.from(new Set(newSearches));
        return uniqueSearches.slice(0, 5);
      });
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setError("Failed to fetch coin data. Please try again.");
    }
    setIsLoading(false);
  };

  const handleSetAlert = () => {
    const price = parseFloat(
      prompt("Enter the price to set an alert for:", "0") || "0"
    );
    if (!isNaN(price)) {
      const id = input || "global";
      setAlerts((prev) => [...prev, { id, price }]);
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
  };

  const handleDeleteAlert = (index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleLogin = () => {
    setUser({ name: "User" });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubscribeAlerts = () => {
    if (email) {
      alert(`Subscribed to alerts for ${email}`);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const fetchNews = async (coinId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/coin/${coinId}/news`);
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news. Please try again.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (alerts.length > 0) {
      const checkPriceAlerts = () => {
        coins.forEach((coin) => {
          alerts.forEach((alert, index) => {
            if (
              (alert.id === "global" || alert.id === coin.id) &&
              coin.market_data?.current_price?.usd &&
              coin.market_data.current_price.usd >= alert.price
            ) {
              if (Notification.permission === "granted") {
                new Notification(
                  `Price alert! ${coin.name} has reached $${alert.price}`
                );
              }
              handleDeleteAlert(index);
            }
          });
        });
      };
      checkPriceAlerts();
    }
  }, [coins, alerts]);

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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <SearchBar
        input={input}
        setInput={setInput}
        handleSearch={handleSearch}
        handleSetAlert={handleSetAlert}
        handleClearAlerts={handleClearAlerts}
        darkMode={darkMode}
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
        filterText={filterText}
        setFilterText={setFilterText}
        filterType={filterType}
        setFilterType={setFilterType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        darkMode={darkMode}
      />
      <AlertManager
        alerts={alerts}
        coins={coins}
        darkMode={darkMode}
        filterAlerts={filterAlerts}
        handleDeleteAlert={handleDeleteAlert}
        setFilterAlerts={setFilterAlerts}
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
          onChange={handleSetEmail}
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
      <FavoriteCoins
        coins={coins}
        favorites={favorites}
        darkMode={darkMode}
        chartPeriod={chartPeriod}
      />
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
            coins={coins}
            darkMode={darkMode}
            favorites={favorites}
            handleFavorite={handleFavorite}
            chartPeriod={chartPeriod}
            filterText={filterText}
            filterType={filterType}
            priceRange={priceRange}
            sortBy={sortBy}
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
