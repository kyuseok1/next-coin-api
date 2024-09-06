"use client";
import { Parallax } from "react-parallax";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AlertManager from "./components/AlertManager";
import CoinFilter from "./components/CoinFilter";
import CoinList from "./components/CoinList";
import FavoriteCoins from "./components/FavoriteCoins";
import NewsSection from "./components/NewsSection";
import SearchBar from "./components/SearchBar";
import { Coin } from "../ui/CoinInfo";
import { useTranslation } from "react-i18next";
import { fetchCoins, fetchCoinById } from "../lib/coinApi";

type Alert = { id: string; price: number };
type NewsArticle = { title: string; url: string };

const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchCoinsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCoins(filterType, page);
      console.log("Fetched coins:", data);
      setCoins([...data]);
    } catch (error) {
      console.error("Error fetching coins data:", error);
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
      console.error("Error fetching coin data:", error);
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
  }, [coins, t]);

  const handleUpdateAlertPrice = (index: number, newPrice: number) => {
    setAlerts((prev) =>
      prev.map((alert, i) =>
        i === index ? { ...alert, price: newPrice } : alert
      )
    );
  };
  const handleAddAlert = (id: string, price: number) => {
    const newAlert: Alert = { id, price };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };
  const handleDeleteAlert = (index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };
  const handleLogin = useCallback(() => setUser({ name: "User" }), []);
  const handleLogout = useCallback(() => setUser(null), []);

  const handleSubscribeAlerts = useCallback(
    () =>
      email
        ? alert(`${t("Subscribed to alerts for")} ${email}`)
        : alert(t("Please enter a valid email address.")),
    [email, t]
  );

  const loaderComponent = isLoading && (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>
  );

  const errorComponent = error && (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 text-2xl">{error}</div>
    </div>
  );

  const coinListComponent = !isLoading && !error && (
    <div>
      <CoinList
        sortBy={{
          key: "price",
          order: "desc",
        }}
        handleSort={function (key: "price" | "24h" | "market_cap"): void {
          throw new Error("Function not implemented.");
        }}
        {...{
          coins,
          darkMode,
          favorites,
          handleFavorite,
          chartPeriod,
          filterText,
          filterType,
          priceRange,
        }}
      />
      <div className="flex justify-center mt-8"></div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : " "
      }  pr-4 pb-4 pl-4`}
    >
      <div>
        <Parallax
          className="parallax"
          bgImage="/images/home4.jpg"
          strength={700} // 강도 조절
        >
          <div className="relative">
            <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-screen">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                {t("코인의 모든것")}
              </h1>
              <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
                {t("커뮤니티에서 쉽고 간편하게")}
              </p>
            </section>

            <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-screen">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                {t("코인 정보를 한곳에서 보고 ")}
              </h1>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                {t("한 곳에서 관리하세요.")}
              </h1>
              <h1 className="text-lg md:text-2xl text-gray-300 leading-relaxed">
                {t("이제껏 경험 못했던 편리한 서비스")}
              </h1>
              <h1 className="text-lg md:text-2xl text-gray-300 leading-relaxed">
                {t("커뮤니티와 함께라면 새로워질 거에요.")}
              </h1>
            </section>

            <section className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-black bg-opacity-60 h-screen">
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
                {t("찾으시는 정보가 있으신가요?")}
              </p>
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
                {t("누구나 쉽게 찾을수 있답니다.")}
              </p>
            </section>
          </div>
        </Parallax>
      </div>
      <div className="min-h-screen rounded-lg shadow-md mb-8 border-b border-gray-300 pb-4 ">
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
        <div className="flex justify-center mt-4">
          <div className="flex-[2]">
            <NewsSection />
          </div>

          <div className="flex-[1] flex flex-col items-center">
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
              alerts={alerts}
              coins={coins}
              filterAlerts={filterAlerts}
              handleDeleteAlert={handleDeleteAlert}
              setFilterAlerts={setFilterAlerts}
              handleUpdateAlertPrice={handleUpdateAlertPrice}
              handleAddAlert={handleAddAlert}
            />
          </div>

          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">
                {t("Recent Searches")}
              </h2>
              <div className="flex space-x-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => router.push(`/coin/${search}`)}
                    className={`p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <FavoriteCoins
          {...{
            coins,
            favorites,
            darkMode,
            chartPeriod,
            handleFavorite,
          }}
        />

        {loaderComponent}
        {errorComponent}
        {coinListComponent}
      </div>
    </div>
  );
};

export default Home;
