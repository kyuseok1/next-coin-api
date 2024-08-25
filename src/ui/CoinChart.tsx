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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type CoinChartProps = {
  prices: Array<{ timestamp: number; price: number }>;
  period: string;
};

const CoinChart = ({ prices, period }: CoinChartProps) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (prices && prices.length > 0) {
      const data = {
        labels: prices.map((point) =>
          new Date(point.timestamp * 1000).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Price",
            data: prices.map((point) => point.price),
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

  if (loading) {
    return <div>로딩 중...</div>;
  }

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

  return (
    <div className="w-full h-full" style={{ position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CoinChart;
