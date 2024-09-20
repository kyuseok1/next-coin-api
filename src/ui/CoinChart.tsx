import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
// 어댑터 import 추가
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type CoinChartProps = {
  prices: Array<{ timestamp: number; price: number }>;
  period: string;
};

const CoinChart = ({ prices, period }: CoinChartProps) => {
  console.log(prices);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    if (prices && prices.length > 0) {
      console.log(
        "타임스탬프 데이터:",
        prices.map((point) => point.timestamp)
      );

      const data = {
        labels: prices.map((point) => new Date(point.timestamp)),
        datasets: [
          {
            label: "Price",
            data: prices.map((point) => ({
              x: new Date(point.timestamp),
              y: point.price,
            })),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
        ],
      };

      setChartData(data);
      setLoading(false);
    }
  }, [prices]);

  useEffect(() => {
    if (!loading && chartData) {
      setChartReady(true);
    }
  }, [loading, chartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Coin Price Chart (${period})`,
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: number | string) {
            return `$${Number(value).toLocaleString()}`;
          },
        },
      },
    },
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="w-full h-full" style={{ position: "relative" }}>
      {chartReady ? (
        <Line data={chartData} options={options} />
      ) : (
        <div>차트 준비 중...</div>
      )}
    </div>
  );
};

export default CoinChart;
