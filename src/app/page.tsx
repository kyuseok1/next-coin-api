"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ParallaxSection from "./components/ParallaxSection";
import MainContent from "./components/MainContent";
import { Coin } from "../ui/CoinInfo";
import { useTranslation } from "react-i18next";
import { fetchCoins, fetchCoinById } from "../lib/coinApi";
import CoinList from "./components/CoinList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/Error";

type Alert = { id: string; price: number };

const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [page] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterAlerts] = useState<string>("all");
  const [darkMode] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod] = useState("1d");
  const [sortBy, setSortBy] = useState<{
    key: "price" | "24h" | "market_cap";
    order: "asc" | "desc";
  }>({
    key: "price",
    order: "desc",
  });

  const fetchCoinsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCoins(filterType, page);
      setCoins([...data]);
    } catch (error) {
      setError(t("Failed to fetch coin data. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [filterType, page, t]);

  useEffect(() => {
    fetchCoinsData();
  }, [fetchCoinsData]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCoinById(input);
      setCoins(data);
      setRecentSearches((prev) =>
        Array.from(new Set([input, ...prev])).slice(0, 5)
      );
    } catch (error) {
      setError(t("Failed to fetch coin data. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [input, t]);

  const handleSetAlert = useCallback(() => {
    const price = parseFloat(
      prompt(t("알림을 설정할 가격을 입력하세요:"), "0") || "0"
    );
    if (!isNaN(price)) {
      setAlerts((prev) => [...prev, { id: input || "global", price }]);
      Notification.permission !== "granted" && Notification.requestPermission();
    }
  }, [input, t]);

  const handleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  }, []);

  const handleSort = useCallback((key: "price" | "24h" | "market_cap") => {
    setSortBy((prev) => ({
      key,
      order: prev.key === key ? (prev.order === "asc" ? "desc" : "asc") : "asc",
    }));
  }, []);

  const sortedCoins = [...coins].sort((a, b) => {
    const getValue = (coin: Coin) => {
      switch (sortBy.key) {
        case "price":
          return coin.market_data?.current_price?.usd || 0;
        case "24h":
          return coin.market_data?.price_change_percentage_24h || 0;
        case "market_cap":
          return coin.market_data?.market_cap?.usd || 0;
        default:
          return 0;
      }
    };

    const valueA = getValue(a);
    const valueB = getValue(b);

    return sortBy.order === "asc" ? valueA - valueB : valueB - valueA;
  });

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
                `${matchingCoin.name} ${t("이 설정한 가격에 도달했습니다:")} $${
                  alert.price
                }`
              );
            }
            setAlerts((prev) => prev.filter((_, i) => i !== index));
          }
        }
      });
    };

    checkPriceAlerts();
  }, [alerts, coins, t]);

  const handleDeleteAlert = (index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  const loaderComponent = isLoading && <Loader />;

  const errorComponent = error && <ErrorMessage message={error} />;

  const coinListComponent = !isLoading && !error && (
    <CoinList
      handleSort={handleSort}
      sortBy={sortBy}
      {...{
        coins: sortedCoins,
        darkMode,
        favorites,
        handleFavorite,
        chartPeriod,
        filterText,
        filterType,
        priceRange,
      }}
    />
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : ""
      } pr-4 pb-4 pl-4`}
    >
      <ParallaxSection />
      <MainContent
        input={input}
        setInput={setInput}
        handleSearch={handleSearch}
        handleSetAlert={handleSetAlert}
        darkMode={darkMode}
        filterText={filterText}
        setFilterText={setFilterText}
        filterType={filterType}
        setFilterType={setFilterType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        alerts={alerts}
        coins={coins}
        filterAlerts={filterAlerts}
        handleDeleteAlert={handleDeleteAlert}
        recentSearches={recentSearches}
        favorites={favorites}
        chartPeriod={chartPeriod}
        handleFavorite={handleFavorite}
        loaderComponent={loaderComponent}
        errorComponent={errorComponent}
        coinListComponent={coinListComponent}
      />
    </div>
  );
};

export default Home;
