"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CoinInfo, { Coin } from "../ui/CoinInfo";
import CoinChart from "../ui/CoinChart";

const Home = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopCoins = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/coin`);
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching top coins data:", error);
      }
      setIsLoading(false);
    };

    fetchTopCoins();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/coin?coinId=${input}`);
      const data = await response.json();
      setCoins([data]);
    } catch (error) {
      console.error("Error fetching coin data:", error);
      alert("Failed to fetch coin data. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Crypto Coin Information
      </h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter coin ID (e.g., bitcoin)"
          className="border p-2 rounded-l-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Search
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coins.map((coin) => (
            <Link key={coin.id} href={`/coin/${coin.id}`} passHref>
              <div className="cursor-pointer bg-white p-4 rounded-lg shadow-md">
                <CoinInfo coin={coin} />
                {coin.prices && (
                  <div className="mt-4">
                    <CoinChart prices={coin.prices} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
