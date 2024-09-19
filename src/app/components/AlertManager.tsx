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
  coins: any[];
  filterAlerts: string;
  setFilterAlerts: (value: string) => void;
};

const AlertManager: React.FC<AlertManagerProps> = ({
  coins,
  filterAlerts,
  setFilterAlerts,
}) => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>("");
  const [newAlertId, setNewAlertId] = useState<string>("");
  const [newAlertPrice, setNewAlertPrice] = useState<number | string>("");
  const [showAddAlert, setShowAddAlert] = useState<boolean>(false);
  const [alertSent, setAlertSent] = useState<Set<string>>(new Set());

  // 현재 가격 가져오기 (API 호출 가정)
  const fetchCurrentPrice = async (id: string) => {
    // 여기에 실제 API 호출 코드 작성
    // 예시로 고정된 가격 반환
    return 100; // 실제 가격을 반환하도록 수정
  };

  // 쿠키에서 알림 로드
  useEffect(() => {
    const savedAlerts = getCookie("alerts");
    if (savedAlerts) {
      const parsedAlerts: Alert[] = JSON.parse(savedAlerts);
      const updatedAlerts = [...alerts];

      parsedAlerts.forEach((alert: Alert) => {
        const isAlertExist = updatedAlerts.some(
          (existingAlert) =>
            existingAlert.id === alert.id && existingAlert.price === alert.price
        );

        if (!isAlertExist) {
          updatedAlerts.push(alert);
        }
      });

      setAlerts(updatedAlerts); // 상태 업데이트
      saveAlertsToCookie(updatedAlerts); // 쿠키에 저장
    }
  }, []);

  const saveAlertsToCookie = (alerts: Alert[]) => {
    setCookie("alerts", JSON.stringify(alerts), 7);
  };

  const handleDeleteAlert = (index: number) => {
    const updatedAlerts = alerts.filter((_, i) => i !== index);
    setAlerts(updatedAlerts); // 상태 업데이트
    saveAlertsToCookie(updatedAlerts); // 쿠키에 저장
  };

  const handleAddAlert = (id: string, price: number) => {
    const newAlert = { id, price };
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts); // 상태 업데이트
    saveAlertsToCookie(updatedAlerts); // 쿠키에 저장
  };

  // 알림 필터링
  const filteredAlerts = useMemo(() => {
    const result = alerts.filter((alert) => {
      if (filterAlerts === "all") return true;
      return alert.id === filterAlerts;
    });
    return result;
  }, [alerts, filterAlerts]);

  useEffect(() => {
    const checkAlerts = async () => {
      for (const alert of alerts) {
        const currentPrice = await fetchCurrentPrice(alert.id);
        const alertKey = `${alert.id}-${alert.price}`;

        if (currentPrice > alert.price && !alertSent.has(alertKey)) {
          new Notification("Price Alert", {
            body: `The price of ${alert.id} has exceeded your alert value of $${alert.price}. Current price: $${currentPrice}`,
          });

          console.log(
            `Alert! The price of ${alert.id} has exceeded the alert value of $${alert.price}. Current price: $${currentPrice}`
          );

          // 이미 보낸 알림으로 상태 업데이트
          setAlertSent((prev) => new Set(prev).add(alertKey));
        }
      }
    };

    const intervalId = setInterval(checkAlerts, 60000); // 1분마다 확인

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클리어
  }, [alerts, alertSent]);

  const handleEditClick = (index: number, currentPrice: number) => {
    setEditingIndex(index);
    setNewPrice(currentPrice);
  };

  const handleSaveClick = (index: number) => {
    if (!isNaN(Number(newPrice))) {
      const updatedAlerts = alerts.map((alert, i) =>
        i === index ? { ...alert, price: Number(newPrice) } : alert
      );
      setAlerts(updatedAlerts); // 상태 업데이트
      saveAlertsToCookie(updatedAlerts); // 쿠키에 저장
      setEditingIndex(null);
      setNewPrice("");
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
