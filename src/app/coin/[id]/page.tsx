"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CoinInfo, { Coin } from "../../../ui/CoinInfo";
import CoinChart from "../../../ui/CoinChart";

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

  useEffect(() => {
    const fetchCoinData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/coin?coinId=${id}`);
          const data = await response.json();
          setCoin(data);
        } catch (error) {
          console.error("Error fetching coin data:", error);
        }
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      ) : coin ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <CoinInfo coin={coin} />
          {coin.prices && (
            <div className="mt-4">
              <CoinChart prices={coin.prices} period="1d" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Coin not found</div>
        </div>
      )}
    </div>
  );
};

export default CoinDetail;
