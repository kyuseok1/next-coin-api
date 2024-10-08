import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

type SearchBarProps = {
  input: string;
  setInput: (value: string) => void;
  handleSearch: () => void;
  handleSetAlert: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  input,
  setInput,
  handleSearch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100">
      <div className="flex items-center">
        <img
          src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
          alt="Logo"
          className="w-10 h-10 mr-2"
        />
        <span className="text-xl font-bold">{t(" Information")}</span>{" "}
      </div>

      <div className="flex items-center space-x-6 text-gray-700">
        <Link
          href="/coin"
          className="hover:text-blue-500 hover:underline hover:scale-110 transform transition duration-300 ease-in-out"
        >
          {t("Coins")}
        </Link>
        <Link
          href="/exchanges"
          className="hover:text-blue-500 hover:underline hover:scale-110 transform transition duration-300 ease-in-out"
        >
          {t("Exchanges")}
        </Link>
        <Link
          href="/nft"
          className="hover:text-blue-500 hover:underline hover:scale-110 transform transition duration-300 ease-in-out"
        >
          NFT{" "}
        </Link>
        <Link
          href="#learn"
          className="hover:text-blue-500 hover:underline hover:scale-110 transform transition duration-300 ease-in-out"
        >
          {t("Learn", { defaultValue: "Learn" })}{" "}
        </Link>
        <Link
          href="#products"
          className="hover:text-blue-500 hover:underline hover:scale-110 transform transition duration-300 ease-in-out"
        >
          {t("Products", { defaultValue: "Products" })}{" "}
        </Link>
      </div>

      <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden max-w-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("Search")}
          className="bg-transparent outline-none px-4 py-2 w-full text-gray-700"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors duration-300 ease-in-out"
        >
          {t("Search")}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
