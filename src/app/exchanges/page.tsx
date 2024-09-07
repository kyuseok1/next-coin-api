"use client";
import React, { useEffect, useState } from "react";
import { exchangeList } from "../../lib/coinApi";
import Link from "next/link";

type Exchange = {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
};

const ExchangePage: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const data = await exchangeList();
        console.log("Fetched Exchange List:", data);
        setExchanges(data);
      } catch (error) {
        setError("Failed to fetch exchange data.");
        console.error("Error fetching exchange data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Exchange Page</h1>
      <p className="mb-4">Here are some exchanges:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exchanges.map((exchange) => (
          <Link
            key={exchange.id}
            href={exchange.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-4 border rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <img
                src={exchange.image}
                alt={exchange.name}
                className="w-16 h-16 mb-4 rounded-full"
              />
              <h2 className="text-xl font-semibold">{exchange.name}</h2>
              <p className="text-gray-500">Country: {exchange.country}</p>
              <p className="text-gray-500">
                Trust Score: {exchange.trust_score}
              </p>
              <p className="text-gray-500">
                Trade Volume (24h BTC):{" "}
                {exchange.trade_volume_24h_btc.toLocaleString()} BTC
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExchangePage;
