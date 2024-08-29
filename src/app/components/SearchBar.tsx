import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

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
    <div className="flex items-center justify-between p-4 shadow-md">
      <div className="flex items-center">
        <img
          src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
          alt="Logo"
          className="w-10 h-10 mr-2"
        />
        <span className="text-xl font-bold">{t(" Information")}</span>{" "}
      </div>

      <div className="flex items-center space-x-6 text-gray-700">
        <Link href="#cryptocurrencies" className="hover:text-blue-500">
          {t("Coins")}
        </Link>
        <Link href="#exchanges" className="hover:text-blue-500">
          {t("Exchanges")}
        </Link>
        <Link href="/nft" className="hover:text-blue-500">
          NFT{" "}
        </Link>
        <Link href="#learn" className="hover:text-blue-500">
          {t("Learn", { defaultValue: "Learn" })}{" "}
        </Link>
        <Link href="#products" className="hover:text-blue-500">
          {t("Products", { defaultValue: "Products" })}{" "}
        </Link>
      </div>

      <div className="flex items-center bg-gray-100 p-2 rounded-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Search")}
          className="bg-transparent outline-none px-2 w-32 shadow-md"
        />
        <button onClick={handleSearch} className="text-blue-500 px-2">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
