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
  // 데이터가 없는 경우 null 반환
  if (!prices || prices.length === 0) {
    return null;
  }

  const data = {
    labels: prices.map((point) =>
      new Date(point.timestamp).toLocaleDateString()
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
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default CoinChart;
