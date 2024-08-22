import React from "react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
  input: string;
  setInput: (value: string) => void;
  handleSearch: () => void;
  handleSetAlert: () => void;
  handleClearAlerts: () => void;
  darkMode: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  input,
  setInput,
  handleSearch,
  handleSetAlert,
  handleClearAlerts,
  darkMode,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="flex w-full md:w-auto mb-4 md:mb-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Enter coin ID (e.g., bitcoin)")}
          className={`border p-3 rounded-l-lg flex-grow ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition duration-300"
        >
          {t("Search")}
        </button>
      </div>
      <div className="flex">
        <button
          onClick={handleSetAlert}
          className="bg-green-500 text-white p-3 rounded-lg ml-0 md:ml-2 hover:bg-green-600 transition duration-300"
        >
          {t("Set Price Alert")}
        </button>
        <button
          onClick={handleClearAlerts}
          className="bg-red-500 text-white p-3 rounded-lg ml-2 hover:bg-red-600 transition duration-300"
        >
          {t("Clear Alerts")}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
