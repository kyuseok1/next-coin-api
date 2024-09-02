import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Alert = {
  id: string;
  price: number;
};

type AlertManagerProps = {
  alerts: Alert[];
  coins: any[];
  darkMode: boolean;
  filterAlerts: string;
  handleDeleteAlert: (index: number) => void;
  setFilterAlerts: (value: string) => void;
  handleUpdateAlertPrice: (index: number, newPrice: number) => void;
  handleAddAlert: (id: string, price: number) => void;
};

const AlertManager: React.FC<AlertManagerProps> = ({
  alerts,
  coins,

  filterAlerts,
  handleDeleteAlert,
  setFilterAlerts,
  handleUpdateAlertPrice,
  handleAddAlert,
}) => {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>("");
  const [newAlertId, setNewAlertId] = useState<string>("");
  const [newAlertPrice, setNewAlertPrice] = useState<number | string>("");
  const [showAddAlert, setShowAddAlert] = useState<boolean>(false);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterAlerts === "all") return true;
    return alert.id === filterAlerts;
  });

  const handleEditClick = (index: number, currentPrice: number) => {
    setEditingIndex(index);
    setNewPrice(currentPrice);
  };

  const handleSaveClick = (index: number) => {
    if (!isNaN(Number(newPrice))) {
      handleUpdateAlertPrice(index, Number(newPrice));
      setEditingIndex(null);
      setNewPrice("");
    }
  };

  const handleAddAlertClick = () => {
    if (newAlertId && !isNaN(Number(newAlertPrice))) {
      handleAddAlert(newAlertId, Number(newAlertPrice));
      setNewAlertId("");
      setNewAlertPrice("");
      setShowAddAlert(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 ">
        {t("Price Alerts")}
      </h2>

      <button
        onClick={() => setShowAddAlert(!showAddAlert)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out"
      >
        {showAddAlert ? t("Cancel") : t("Add New Alert")}
      </button>

      {showAddAlert && (
        <div className="flex flex-col items-center w-full max-w-sm bg-white  p-4 rounded-lg shadow-lg mb-4">
          <select
            value={newAlertId}
            onChange={(e) => setNewAlertId(e.target.value)}
            className="w-full border p-2 rounded-lg mb-2 "
          >
            <option value="">{t("Select Coin")}</option>
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder={t("Enter Alert Price")}
            value={newAlertPrice}
            onChange={(e) => setNewAlertPrice(e.target.value)}
            className="w-full border p-2 rounded-lg mb-4 "
          />
          <button
            onClick={handleAddAlertClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full"
          >
            {t("Add Alert")}
          </button>
        </div>
      )}

      <ul className="w-full max-w-md  p-4 rounded-lg shadow-lg">
        {filteredAlerts.length === 0 ? (
          <li className="text-center ">{t("No alerts found.")}</li>
        ) : (
          filteredAlerts.map((alert, index) => (
            <li
              key={index}
              className="flex justify-between items-center mb-4 p-3 rounded-lg bg-gray-100 "
            >
              {editingIndex === index ? (
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="border p-2 rounded-lg mr-2 "
                />
              ) : (
                <span className="text-gray-800 ">
                  {alert.id === "global"
                    ? `${t("Global alert for")} $${alert.price}`
                    : `${t("Alert for")} ${alert.id} ${t("at")} $${
                        alert.price
                      }`}
                </span>
              )}
              <div className="flex space-x-2">
                {editingIndex === index ? (
                  <button
                    onClick={() => handleSaveClick(index)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    {t("Save")}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(index, alert.price)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    {t("Edit")}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAlert(index)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  {t("Delete")}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AlertManager;
