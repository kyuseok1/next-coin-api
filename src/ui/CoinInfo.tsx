import React from "react";

type AdditionalData = {
  market_cap_rank: number;
  hashing_algorithm: string;
  genesis_date: string;
  developer_data: {
    stars: number;
    forks: number;
    total_issues: number;
    [key: string]: any;
  };
  description: {
    en: string;
    [key: string]: any;
  };
  links: {
    homepage: string[];
    whitepaper: string;
  };
  [key: string]: any;
};

type Coin = {
  current_price: any;
  price_change_percentage_24h: any;
  market_cap: any;
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
  prices: { timestamp: number; price: number }[];
  additional?: AdditionalData;
  type?: string;
};

type CoinProps = {
  coin: Coin;
};

const CoinInfo = ({ coin }: CoinProps) => {
  const currentPrice = coin.current_price ?? "N/A";
  const marketCap = coin.market_cap ?? "N/A";
  const imageUrl = coin.image;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">
        {coin.name} ({coin.symbol})
      </h2>
      {imageUrl ? (
        <img src={imageUrl} alt={coin.name} className="mx-auto mb-1" />
      ) : (
        <div className="mx-auto mb-1">No image available</div>
      )}
      <p className="text-lg">Current Price: ${currentPrice}</p>
      <p className="text-lg">Market Cap: ${marketCap}</p>
    </div>
  );
};

export default CoinInfo;
export type { Coin };
