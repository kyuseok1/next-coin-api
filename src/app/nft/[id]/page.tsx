"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchNftById } from "../../../lib/coinApi";
import UserControls from "../../components/UserControls";
type NFT = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: {
    small: string;
    large: string;
  };
};

const NFTDetailPage: React.FC = () => {
  const { id } = useParams();

  const nftId = Array.isArray(id) ? id[0] : id;
  const [period, setPeriod] = useState<"1d" | "7d" | "30d">("7d");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const user = { name: "" };
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
        setNft(data);
      } catch (err) {
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
    <div className="p-8">
      <UserControls
        handleLogin={() => console.log("Login")}
        handleLogout={() => console.log("Logout")}
        {...{ darkMode, setDarkMode, language, setLanguage, user }}
      />
      <h1 className="text-3xl font-bold mb-6">NFT Details</h1>
      {nft && (
        <>
          <img src={nft.image.large} alt={nft.name} className="mb-4" />
          <p className="mb-4">NFT Name: {nft.name}</p>
          <p className="mb-4">Symbol: {nft.symbol}</p>
          <p className="mb-4">Description: {nft.description}</p>
        </>
      )}
    </div>
  );
};

export default NFTDetailPage;
