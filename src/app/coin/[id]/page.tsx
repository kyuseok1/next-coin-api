"use client";
import { useState, useEffect } from "react";
import CoinChart from "../../../ui/CoinChart";
import { Coin } from "../../../ui/CoinInfo";

type Params = {
  id: string;
};

type CoinDetailProps = {
  params: Params;
};

const CoinDetail = ({ params }: CoinDetailProps) => {
  const { id } = params;
  const [coin, setCoin] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<"1d" | "7d" | "30d">("7d"); // 기본값을 7일로 설정

  useEffect(() => {
    const fetchCoinData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/coin?coinId=${id}&period=${period}`
          );
          const data = await response.json();

          console.log("Fetched coin data:", data); // 가져온 데이터를 콘솔에 기록

          setCoin(data);
        } catch (error) {
          console.error("Error fetching coin data:", error);
        }
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [id, period]); // 기간이 변경될 때 데이터를 다시 가져옴

  // 디바운스 함수의 타입 주석
  const debounce = <F extends (...args: any[]) => void>(
    func: F,
    delay: number
  ): F => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    }) as F;
  };

  // 기간 변경 처리 함수의 타입 주석
  const handlePeriodChange = (newPeriod: "1d" | "7d" | "30d") => {
    if (newPeriod !== period) {
      setPeriod(newPeriod);
    }
  };

  const debouncedPeriodChange = debounce(handlePeriodChange, 300);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      ) : coin ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {coin.prices && (
            <div className="mt-4">
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 ${
                    period === "1d" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => debouncedPeriodChange("1d")}
                >
                  1일
                </button>
                <button
                  className={`px-4 py-2 ${
                    period === "7d" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => debouncedPeriodChange("7d")}
                >
                  7일
                </button>
                <button
                  className={`px-4 py-2 ${
                    period === "30d" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => debouncedPeriodChange("30d")}
                >
                  30일
                </button>
              </div>
              <CoinChart prices={coin.prices} period={period} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">코인을 찾을 수 없습니다</div>
        </div>
      )}
    </div>
  );
};

export default CoinDetail;
