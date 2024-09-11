"use client";
import React, { useEffect, useState } from "react";
import { nftList } from "../api/coin/route";
import Link from "next/link";

type NFT = {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id: string;
  contract_address: string;
};

const NFTPage: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const data = await nftList();
        console.log("Fetched NFT List:", data);
        setNfts(data);
      } catch (error) {
        setError("Failed to fetch NFT data.");
        console.error("Error fetching NFT data:", error);
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
              <p className="text-gray-500">Platform: {nft.asset_platform_id}</p>
              <p className="text-gray-500">Contract: {nft.contract_address}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NFTPage;
