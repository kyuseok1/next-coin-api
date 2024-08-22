import React from "react";
import { useTranslation } from "react-i18next";

type CoinFilterProps = {
  filterText: string;
  setFilterText: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  darkMode: boolean;
};

const CoinFilter: React.FC<CoinFilterProps> = ({
  filterText,
  setFilterText,
  filterType,
  setFilterType,
  priceRange,
  setPriceRange,
  darkMode,
}) => {
  const { t } = useTranslation();

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    console.log("Selected filter type:", selectedType); // 콘솔에 필터 타입 출력
    setFilterType(selectedType);
  };

  const handlePriceRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...priceRange];
    newRange[index] = Number(event.target.value);
    setPriceRange(newRange as [number, number]);
  };

  return (
    <div className="p-6 ">
      <div className="flex justify-center mb-4">
        <select
          onChange={handleFilterTypeChange}
          value={filterType}
          className={`border p-2 rounded-lg w-1/2 md:w-1/3 text-center ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="all">{t("All Types")}</option>
          <option value="trending">{t("Trending Coins")}</option>
        </select>
      </div>
      <div className="flex justify-center items-center mb-4">
        <label className="mr-2 text-gray-700 dark:text-gray-300">
          {t("Price Range")}
        </label>
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => handlePriceRangeChange(e, 0)}
          className={`border p-2 rounded-lg w-24 text-center ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <span className="mx-2 text-gray-700 dark:text-gray-300">-</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => handlePriceRangeChange(e, 1)}
          className={`border p-2 rounded-lg w-24 text-center ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );
};

export default CoinFilter;
