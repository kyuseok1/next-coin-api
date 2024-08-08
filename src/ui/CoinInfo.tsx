import React from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image?: {
    thumb: string;
  };
  market_data?: {
    current_price?: {
      usd?: number;
    };
    market_cap?: {
      usd?: number;
    };
    price_change_percentage_24h?: number;
  };
  prices?: Array<{ timestamp: number; price: number }>;
  type?: string;
};

type CoinProps = {
  coin: Coin;
};

const CoinInfo = ({ coin }: CoinProps) => {
  const currentPrice = coin.market_data?.current_price?.usd ?? "N/A";
  const marketCap = coin.market_data?.market_cap?.usd ?? "N/A";
  const imageUrl = coin.image?.thumb;

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
