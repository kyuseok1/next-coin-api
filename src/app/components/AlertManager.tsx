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
  handleAddAlert: (id: string, price: number) => void; // 새로운 알림 추가 함수
};

const AlertManager: React.FC<AlertManagerProps> = ({
  alerts,
  coins,
  darkMode,
  filterAlerts,
  handleDeleteAlert,
  setFilterAlerts,
  handleUpdateAlertPrice,
  handleAddAlert, // 새로운 알림 추가 함수
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
      setShowAddAlert(false); // 추가 후 입력 필드 숨기기
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <h2 className="text-2xl font-bold mb-2">{t("Price Alerts")}</h2>

      {/* 알림 추가 버튼 */}
      <button
        onClick={() => setShowAddAlert(!showAddAlert)}
        className="bg-blue-500 text-white p-2 rounded-md mb-4"
      >
        {showAddAlert ? t("Cancel") : t("Add New Alert")}
      </button>

      {showAddAlert && (
        <div className="flex flex-col items-center mb-4">
          <select
            value={newAlertId}
            onChange={(e) => setNewAlertId(e.target.value)}
            className="border p-2 rounded-md mb-2"
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
            className="border p-2 rounded-md mb-2"
          />
          <button
            onClick={handleAddAlertClick}
            className="bg-green-500 text-white p-2 rounded-md"
          >
            {t("Add Alert")}
          </button>
        </div>
      )}

      <ul className="w-full max-w-md">
        {filteredAlerts.length === 0 ? (
          <li className="text-center">{t("No alerts found.")}</li>
        ) : (
          filteredAlerts.map((alert, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {editingIndex === index ? (
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="border p-2 rounded-md mr-2"
                />
              ) : (
                <span>
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
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                    {t("Save")}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(index, alert.price)}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    {t("Edit")}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAlert(index)}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  {t("Delete")}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <select
        onChange={(e) => setFilterAlerts(e.target.value)}
        value={filterAlerts}
        className={`border p-2 rounded-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } mt-2`}
      >
        <option value="all">{t("All Alerts")}</option>
        {coins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlertManager;
