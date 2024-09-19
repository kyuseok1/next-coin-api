"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Coin } from "../../ui/CoinInfo";

const fetchTopCoins = async () => {
  const response = await fetch("/api/coin?fetchCoins=true");
  if (!response.ok) {
    throw new Error("Failed to fetch top coins");
  }
  return response.json();
};

const CoinPage: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        const data = await fetchTopCoins();
        console.log(data);
        setCoins(data);
      } catch (error) {
        setError("Failed to fetch coin data.");
        console.error("Error fetching coin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoinsData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Coin Page</h1>
      <p className="mb-4">Here are some coins:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <Link key={coin.id} href={`/coin/${coin.id}`}>
            <div className="p-4 border rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-16 h-16 mb-4 rounded-full"
              />
              <h2 className="text-xl font-semibold">{coin.name}</h2>
              <p className="text-gray-500">
                Market_cap_rank: {coin.market_cap_rank}
              </p>
              <p className="text-gray-500">
                Current_price: {coin.current_price}
              </p>
              <p className="text-gray-500">Market_cap: {coin.market_cap}</p>
              <p className="text-gray-500">High_24h : {coin.high_24h}</p>
              <p className="text-gray-500">Low_24h : {coin.low_24h}</p>
              <p className="text-gray-500">
                Percentage_24h : {coin.price_change_percentage_24h}%
              </p>
              <p className="text-gray-500">Max_supply : {coin.max_supply}</p>
              <p className="text-gray-500">
                Circulating_supply: {coin.circulating_supply}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoinPage;
