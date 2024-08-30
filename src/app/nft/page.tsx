"use client";
import React, { useEffect, useState } from "react";
import { nftList } from "../../lib/coinApi";
import UserControls from "../components/UserControls";
import Link from "next/link";

type NFT = {
  id: string;
  name: string;
  symbol: string;
};

const NFTPage: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<"1d" | "7d" | "30d">("7d");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const user = { name: "" };

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const data = await nftList();
        console.log("Fetched NFT List:", data); // 데이터를 콘솔에 출력
        setNfts(data);
      } catch (error) {
        setError("Failed to fetch NFT data.");
        console.error("Error fetching NFT data:", error); // 오류가 발생한 경우 콘솔에 오류를 출력
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">NFT Page</h1>
      <p className="mb-4">Here are some NFTs:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <Link key={nft.id} href={`/nft/${nft.id}`}>
            <div className="p-4 border rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-xl font-semibold">{nft.name}</h2>
              <p className="text-gray-500">{nft.symbol}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NFTPage;
