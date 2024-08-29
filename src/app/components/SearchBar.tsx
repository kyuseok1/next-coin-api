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
    <div className="flex flex-col md:flex-row justify-center items-center mb-8">
      <div className="flex w-full md:w-auto mb-2 md:mb-0 justify-center">
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
    </div>
  );
};

export default SearchBar;
