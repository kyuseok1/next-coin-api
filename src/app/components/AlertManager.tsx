import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// 쿠키 유틸리티 함수
const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `expires=${date.toUTCString()};`;
  }
  document.cookie = `${name}=${value};${expires}path=/`;
};

const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};

// Alert 타입 정의
type Alert = {
  id: string;
  price: number;
};

type AlertManagerProps = {
  alerts: Alert[];
  coins: any[];
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
  handleUpdateAlertPrice,
  handleAddAlert,
}) => {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>("");
  const [newAlertId, setNewAlertId] = useState<string>("");
  const [newAlertPrice, setNewAlertPrice] = useState<number | string>("");
  const [showAddAlert, setShowAddAlert] = useState<boolean>(false);
  const [alertSent, setAlertSent] = useState<Set<string>>(new Set());

  // 쿠키에서 알림 로드
  useEffect(() => {
    const savedAlerts = getCookie("alerts");
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts);

      // 중복된 알림이 추가되지 않도록 체크
      parsedAlerts.forEach((alert: Alert) => {
        const isAlertExist = alerts.some(
          (existingAlert) =>
            existingAlert.id === alert.id && existingAlert.price === alert.price
        );

        if (!isAlertExist) {
          handleAddAlert(alert.id, alert.price);
        }
      });
    }
  }, [handleAddAlert, alerts]);

  const saveAlertsToCookie = (alerts: Alert[]) => {
    setCookie("alerts", JSON.stringify(alerts), 7);
  };

  const handleDeleteClick = (index: number) => {
    handleDeleteAlert(index);
    const updatedAlerts = alerts.filter((_, i) => i !== index);
    saveAlertsToCookie(updatedAlerts);
  };

  // 알림 확인 로직
  useEffect(() => {
    if (Notification.permission === "granted") {
      const checkAlerts = () => {
        alerts.forEach((alert) => {
          const currentPrice = 100; // API로 받아올 실제 현재 가격
          const alertKey = `${alert.id}-${alert.price}`;

          // 이미 전송된 알림이 있는지 확인
          if (currentPrice > alert.price && !alertSent.has(alertKey)) {
            // 브라우저 알림
            new Notification("Price Alert", {
              body: `The price of ${alert.id} has exceeded your alert value of $${alert.price}. Current price: $${currentPrice}`,
            });

            // 콘솔에 알림 찍기
            console.log(
              `Alert! The price of ${alert.id} has exceeded the alert value of $${alert.price}. Current price: $${currentPrice}`
            );

            // 동일한 알림이 다시 발생하지 않도록 상태 업데이트
            setAlertSent((prev) => {
              const newAlertSent = new Set(prev);
              newAlertSent.add(alertKey); // 알림이 트리거된 key 저장
              return newAlertSent;
            });
          }
        });
      };

      const intervalId = setInterval(checkAlerts, 60000);

      return () => clearInterval(intervalId);
    }
  }, [alerts, alertSent]);

  const filteredAlerts = useMemo(() => {
    console.log("Filter alerts state: ", filterAlerts);
    const result = alerts.filter((alert) => {
      if (filterAlerts === "all") return true;
      return alert.id === filterAlerts;
    });

    console.log("Filtered alerts: ", result);
    return result;
  }, [alerts, filterAlerts]);

  const handleEditClick = (index: number, currentPrice: number) => {
    setEditingIndex(index);
    setNewPrice(currentPrice);
  };

  const handleSaveClick = (index: number) => {
    if (!isNaN(Number(newPrice))) {
      handleUpdateAlertPrice(index, Number(newPrice));
      setEditingIndex(null);
      setNewPrice("");
      const updatedAlerts = alerts.map((alert, i) =>
        i === index ? { ...alert, price: Number(newPrice) } : alert
      );
      saveAlertsToCookie(updatedAlerts);
    }
  };

  const handleAddAlertClick = () => {
    if (newAlertId && !isNaN(Number(newAlertPrice))) {
      const alertExists = alerts.some(
        (alert) =>
          alert.id === newAlertId && alert.price === Number(newAlertPrice)
      );
      if (!alertExists) {
        handleAddAlert(newAlertId, Number(newAlertPrice));
        setNewAlertId("");
        setNewAlertPrice("");
        setShowAddAlert(false);
        const updatedAlerts = [
          ...alerts,
          { id: newAlertId, price: Number(newAlertPrice) },
        ];
        saveAlertsToCookie(updatedAlerts);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {t("Price Alerts")}
      </h2>

      <button
        onClick={() => setShowAddAlert(!showAddAlert)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out"
      >
        {showAddAlert ? t("Cancel") : t("Add New Alert")}
      </button>

      {showAddAlert && (
        <div className="flex flex-col items-center w-full max-w-sm bg-white p-4 rounded-lg shadow-lg mb-4">
          <select
            value={newAlertId}
            onChange={(e) => setNewAlertId(e.target.value)}
            className="w-full border p-2 rounded-lg mb-2"
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
            className="w-full border p-2 rounded-lg mb-4"
          />
          <button
            onClick={handleAddAlertClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full"
          >
            {t("Add Alert")}
          </button>
        </div>
      )}

      <ul className="w-full max-w-md p-4 rounded-lg shadow-lg">
        {filteredAlerts.length === 0 ? (
          <li className="text-center">{t("No alerts found.")}</li>
        ) : (
          filteredAlerts.map((alert, index) => (
            <li
              key={index}
              className="flex justify-between items-center mb-4 p-3 rounded-lg bg-gray-100"
            >
              {editingIndex === index ? (
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="border p-2 rounded-lg mr-2"
                />
              ) : (
                <span className="text-gray-800">
                  {alert.id === "global"
                    ? `${t("Global alert for")} $${alert.price}`
                    : `${t("Alert for")} ${alert.id} - $${alert.price}`}
                </span>
              )}
              <div>
                {editingIndex === index ? (
                  <button
                    onClick={() => handleSaveClick(index)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out mr-2"
                  >
                    {t("Save")}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(index, alert.price)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out mr-2"
                  >
                    {t("Edit")}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(index)}
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
