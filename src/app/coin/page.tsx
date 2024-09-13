"use client";
import React, { useEffect, useState } from "react";
import { getTopCoins } from "../api/coin/route";
import Link from "next/link";
import { Coin } from "../../ui/CoinInfo";
const CoinPage: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const data = await getTopCoins();
        console.log(data);
        setCoins(data);
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
        {coins.map((coins) => (
          <Link href={`/coin/${coins.id}`}>
            <div className="p-4 border rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <img
                src={coins.image}
                alt={coins.name}
                className="w-16 h-16 mb-4 rounded-full"
              />
              <h2 className="text-xl font-semibold">{coins.name}</h2>
              <p className="text-gray-500">
                Market_cap_rank: {coins.market_cap_rank}
              </p>
              <p className="text-gray-500">
                Current_price: {coins.current_price}
              </p>
              <p className="text-gray-500">Market_cap: {coins.market_cap}</p>
              <p className="text-gray-500">High_24h : {coins.high_24h}</p>
              <p className="text-gray-500">Low_24h : {coins.low_24h}</p>

              <p className="text-gray-500">
                Percentage_24h : {coins.price_change_percentage_24h}%
              </p>
              <p className="text-gray-500">Max_supply : {coins.max_supply}</p>
              <p className="text-gray-500">
                Circulating_supply
                {coins.circulating_supply}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoinPage;
