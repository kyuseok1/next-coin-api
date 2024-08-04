"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CoinInfo, { Coin } from "../ui/CoinInfo";
import CoinChart from "../ui/CoinChart";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

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
      setPage((prevPage) => 1); // 페이지 1로 리셋
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

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleSetAlert = () => {
    const price = parseFloat(
      prompt(t("Enter the price to set an alert for:"), "0") || "0"
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

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogin = () => {
    setUser({ name: "User" });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  const handleChartPeriodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setChartPeriod(event.target.value);
  };

  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterType(event.target.value);
  };

  const handlePriceRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...priceRange];
    newRange[index] = Number(event.target.value);
    setPriceRange(newRange as [number, number]);
  };

  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubscribeAlerts = () => {
    if (email) {
      // Logic to subscribe to email alerts
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

  const sortedCoins = [...coins].sort((a, b) => {
    if (sortBy === "market_cap") {
      return (
        (b.market_data?.market_cap?.usd || 0) -
        (a.market_data?.market_cap?.usd || 0)
      );
    } else if (sortBy === "price") {
      return (
        (b.market_data?.current_price?.usd || 0) -
        (a.market_data?.current_price?.usd || 0)
      );
    }
    return 0;
  });

  const filteredCoins = sortedCoins.filter((coin) => {
    const matchesFilterText = coin.name
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesFilterType = filterType === "all" || coin.type === filterType;
    const matchesPriceRange =
      (coin.market_data?.current_price?.usd || 0) >= priceRange[0] &&
      (coin.market_data?.current_price?.usd || 0) <= priceRange[1];
    return matchesFilterText && matchesFilterType && matchesPriceRange;
  });

  const filteredAlerts = alerts.filter((alert) => {
    if (filterAlerts === "all") return true;
    return alert.id === filterAlerts;
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-4`}
    >
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("Crypto Coin Information")}
      </h1>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleToggleDarkMode}
          className="bg-purple-500 text-white p-2 rounded-md"
        >
          {darkMode ? t("Light Mode") : t("Dark Mode")}
        </button>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border p-2 rounded-md"
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            {t("Logout")}
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-500 text-white p-2 rounded-md"
          >
            {t("Login")}
          </button>
        )}
      </div>
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Enter coin ID (e.g., bitcoin)")}
          className={`border p-2 rounded-l-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          {t("Search")}
        </button>
        <button
          onClick={handleSetAlert}
          className="bg-green-500 text-white p-2 ml-2 rounded-md"
        >
          {t("Set Price Alert")}
        </button>
        <button
          onClick={handleClearAlerts}
          className="bg-red-500 text-white p-2 ml-2 rounded-md"
        >
          {t("Clear Alerts")}
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <select
          onChange={handleSortChange}
          value={sortBy}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <option value="market_cap">{t("Sort by Market Cap")}</option>
          <option value="price">{t("Sort by Price")}</option>
        </select>
      </div>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={t("Filter coins by name")}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        />
      </div>
      <div className="flex justify-center mb-4">
        <select
          onChange={handleFilterTypeChange}
          value={filterType}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <option value="all">{t("All Types")}</option>
          <option value="major">{t("Major Coins")}</option>
          <option value="new">{t("New Coins")}</option>
        </select>
      </div>
      <div className="flex justify-center mb-4">
        <label className="mr-2">{t("Price Range")}</label>
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => handlePriceRangeChange(e, 0)}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        />
        <span className="mx-2">-</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => handlePriceRangeChange(e, 1)}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        />
      </div>
      <div className="flex justify-center mb-4">
        <select
          onChange={(e) => setFilterAlerts(e.target.value)}
          value={filterAlerts}
          className={`border p-2 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <option value="all">{t("All Alerts")}</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center mb-4">
        <select
          onChange={handleChartPeriodChange}
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
      {alerts.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{t("Price Alerts")}</h2>
          <ul>
            {filteredAlerts.map((alert, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>
                  {alert.id === "global"
                    ? `${t("Global alert for")} $${alert.price}`
                    : `${t("Alert for")} ${alert.id} ${t("at")} $${
                        alert.price
                      }`}
                </span>
                <button
                  onClick={() => handleDeleteAlert(index)}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  {t("Delete")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
      {favorites.length > 0 && (
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
                        darkMode
                          ? "bg-gray-800 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <CoinInfo coin={coin} />
                      {coin.prices && (
                        <div className="mt-4">
                          <CoinChart
                            prices={coin.prices}
                            period={chartPeriod}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                )
              );
            })}
          </div>
        </div>
      )}
      {news.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{t("Latest News")}</h2>
          <ul>
            {news.map((article, index) => (
              <li key={index} className="mb-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoins.map((coin) => (
              <div key={coin.id} className="relative">
                <Link href={`/coin/${coin.id}`} passHref>
                  <div
                    className={`cursor-pointer p-4 rounded-lg shadow-md ${
                      darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <CoinInfo coin={coin} />
                    <p className="mt-2 text-sm">
                      {t("24h Change")}:{" "}
                      {coin.market_data?.price_change_percentage_24h?.toFixed(
                        2
                      )}
                      %
                    </p>
                    {coin.prices && (
                      <div className="mt-4">
                        <CoinChart prices={coin.prices} period={chartPeriod} />
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => handleFavorite(coin.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    favorites.includes(coin.id)
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                >
                  ★
                </button>
              </div>
            ))}
          </div>
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
