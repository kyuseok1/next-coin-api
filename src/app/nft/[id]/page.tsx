"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type NFT = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: {
    small: string;
    large: string;
  };
  contract_address: string;
  asset_platform_id: string;
  market_cap: {
    native_currency: number;
    usd: number;
  };
  ath: {
    native_currency: number;
    usd: number;
  };
  floor_price: {
    native_currency: number;
    usd: number;
  };
  total_supply: number;
  number_of_unique_addresses: number;
  links: {
    homepage: string;
    twitter: string;
    discord: string;
  };
};

const fetchNftById = async (nftId: string) => {
  const response = await fetch(`/api/coin?nftId=${nftId}&fetchNftById=true`);
  if (!response.ok) {
    throw new Error("Failed to fetch NFT data");
  }
  return response.json();
};

const NFTDetailPage: React.FC = () => {
  const { id } = useParams();
  const nftId = Array.isArray(id) ? id[0] : id;

  const [nft, setNft] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFT = async () => {
      if (!nftId) {
        setError("Invalid NFT ID.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchNftById(nftId);
        console.log("Fetched NFT Data:", data);
        setNft(data);
      } catch (err) {
        console.error("Error fetching NFT data:", err);
        setError("Failed to load NFT data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFT();
  }, [nftId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">NFT Details</h1>
      {nft && (
        <>
          <img
            src={nft.image.large || nft.image.small}
            onError={(e) => {
              e.currentTarget.src = "/default-image.png";
            }}
            alt={nft.name}
            className="mb-4 w-64 h-64 object-cover rounded-lg shadow-md"
          />
          <p className="mb-4">
            <strong>NFT Name:</strong> {nft.name}
          </p>
          <p className="mb-4">
            <strong>Symbol:</strong> {nft.symbol}
          </p>
          <p className="mb-4">
            <strong>Description:</strong> {nft.description}
          </p>
          <p className="mb-4">
            <strong>Contract Address:</strong> {nft.contract_address}
          </p>
          <p className="mb-4">
            <strong>Asset Platform:</strong> {nft.asset_platform_id}
          </p>
          <p className="mb-4">
            <strong>Market Cap:</strong> {nft.market_cap.native_currency} ETH /
            ${nft.market_cap.usd}
          </p>
          <p className="mb-4">
            <strong>All-Time High:</strong> {nft.ath.native_currency} ETH / $
            {nft.ath.usd}
          </p>
          <p className="mb-4">
            <strong>Floor Price:</strong> {nft.floor_price.native_currency} ETH
            / ${nft.floor_price.usd}
          </p>
          <p className="mb-4">
            <strong>Total Supply:</strong> {nft.total_supply}
          </p>
          <p className="mb-4">
            <strong>Unique Addresses:</strong> {nft.number_of_unique_addresses}
          </p>
          <div className="mb-4">
            <strong>Links:</strong>
            <ul>
              <li>
                <a
                  href={nft.links.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Homepage
                </a>
              </li>
              <li>
                <a
                  href={nft.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={nft.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default NFTDetailPage;
