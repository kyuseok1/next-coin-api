import SearchBar from "../components/SearchBar";
import AlertManager from "../components/AlertManager";
import NewsSection from "../components/NewsSection";
import FavoriteCoins from "../components/FavoriteCoins";
import { useRouter } from "next/navigation";

const MainContent = ({
  input,
  setInput,
  handleSearch,
  handleSetAlert,
  darkMode,
  filterText,
  setFilterText,
  filterType,
  setFilterType,

  alerts,
  coins,
  filterAlerts,
  handleDeleteAlert,
  recentSearches,
  favorites,
  chartPeriod,
  handleFavorite,
  loaderComponent,
  errorComponent,
  coinListComponent,
}: any) => {
  const router = useRouter();

  return (
    <div className="min-h-screen rounded-lg shadow-md mb-8 border-b border-gray-300 pb-4 ">
      <SearchBar
        input={input}
        setInput={setInput}
        handleSearch={handleSearch}
        handleSetAlert={handleSetAlert}
      />
      <div className="flex justify-center mt-4">
        <div className="flex-[2]">
          <NewsSection />
        </div>
        <div className="flex-[1] flex flex-col items-center">
          <AlertManager
            alerts={alerts}
            coins={coins}
            filterAlerts={filterAlerts}
            handleDeleteAlert={handleDeleteAlert}
            setFilterAlerts={() => {}}
            handleUpdateAlertPrice={() => {}}
            handleAddAlert={() => {}}
          />
        </div>
        {recentSearches.length > 0 && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Recent Searches</h2>
            <div className="flex space-x-2">
              {recentSearches.map((search: string) => (
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
        coins={coins}
        favorites={favorites}
        darkMode={darkMode}
        chartPeriod={chartPeriod}
        handleFavorite={handleFavorite}
      />
      {loaderComponent}
      {errorComponent}
      {coinListComponent}
    </div>
  );
};

export default MainContent;
