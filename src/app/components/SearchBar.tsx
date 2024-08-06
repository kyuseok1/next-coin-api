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
  );
};

export default SearchBar;
