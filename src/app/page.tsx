"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import ParallaxSection from "./components/ParallaxSection";
import MainContent from "./components/MainContent";
import { Coin } from "../ui/CoinInfo";
import { useTranslation } from "react-i18next";
import CoinList from "./components/CoinList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/Error";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

const fetchApi = async (path: string) => {
  const response = await fetch(`${COINGECKO_API_URL}/${path}`);
  if (!response.ok) {
    throw new Error("API 요청에 실패했습니다.");
  }
  return response.json();
};

const fetchCoinById = async (id: string) => {
  return fetchApi(`coins/${id}`);
};

const getTopCoins = async () => {
  return fetchApi(
    "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
  );
};

type Alert = { id: string; price: number };

const Home = () => {
  const { t } = useTranslation();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]); // 트렌딩 코인 상태 추가
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [page] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterAlerts] = useState<string>("all");
  const [darkMode] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("all"); // 필터 타입 추가
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

  // 상위 코인 데이터 가져오기
  const getTopCoinsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTopCoins();
      console.log(response);
      if (!Array.isArray(response)) {
        throw new Error("Failed to fetch coin data");
      }
      setCoins(response);
    } catch (error) {
      setError(t("코인 데이터를 가져오는 중 오류가 발생했습니다."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTopCoinsData();
  }, []);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCoinById(input);
      setCoins([data]); // 단일 코인을 배열로 감싸서 설정
      setRecentSearches((prev) =>
        Array.from(new Set([input, ...prev])).slice(0, 5)
      );
    } catch (error) {
      setError(t("Failed to fetch coin data. Please try again."));
    } finally {
      setIsLoading(false);
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

  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      const getValue = (coin: Coin) => {
        switch (sortBy.key) {
          case "price":
            return coin.current_price || 0;
          case "24h":
            return coin.price_change_percentage_24h || 0;
          case "market_cap":
            return coin.market_cap || 0;
          default:
            return 0;
        }
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      return sortBy.order === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [coins, sortBy]);

  const handleDeleteAlert = (index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  const loaderComponent = isLoading && <Loader />;

  const errorComponent = error && <ErrorMessage message={error} />;

  const coinListComponent = !isLoading && !error && (
    <CoinList
      handleSort={handleSort}
      sortBy={sortBy}
      coins={filterType === "trending" ? trendingCoins : sortedCoins}
      darkMode={darkMode}
      favorites={favorites}
      handleFavorite={handleFavorite}
      chartPeriod={chartPeriod}
      filterText={filterText}
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
