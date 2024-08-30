import React from "react";
import { useTranslation } from "react-i18next";

type CoinFilterProps = {
  filterText: string;
  setFilterText: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  darkMode: boolean;
};

const CoinFilter: React.FC<CoinFilterProps> = ({
  filterText,
  setFilterText,
  filterType,
  setFilterType,
  darkMode,
}) => {
  const { t } = useTranslation();

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;

    setFilterType(selectedType);
  };

  return (
    <div className="p-6 ">
      <div className="flex justify-center mb-4">
        <select
          onChange={handleFilterTypeChange}
          value={filterType}
          className={`border p-2 rounded-lg  text-center ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="all">{t("All Types")}</option>
          <option value="trending">{t("Trending Coins")}</option>
        </select>
      </div>
    </div>
  );
};

export default CoinFilter;
