import React from "react";
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
};

const AlertManager: React.FC<AlertManagerProps> = ({
  alerts,
  coins,
  darkMode,
  filterAlerts,
  handleDeleteAlert,
  setFilterAlerts,
}) => {
  const { t } = useTranslation();

  const filteredAlerts = alerts.filter((alert) => {
    if (filterAlerts === "all") return true;
    return alert.id === filterAlerts;
  });

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-2">{t("Price Alerts")}</h2>
      <ul>
        {filteredAlerts.map((alert, index) => (
          <li key={index} className="flex justify-between mb-2">
            <span>
              {alert.id === "global"
                ? `${t("Global alert for")} $${alert.price}`
                : `${t("Alert for")} ${alert.id} ${t("at")} $${alert.price}`}
            </span>
            <button
              onClick={() => handleDeleteAlert(index)}
              className="bg-red-500 text-white p-2 rounded-md"
            >
              {t("Delete")}
            </button>
          </li>
        ))}
      </ul>
      <select
        onChange={(e) => setFilterAlerts(e.target.value)}
        value={filterAlerts}
        className={`border p-2 rounded-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
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
