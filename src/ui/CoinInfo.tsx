// src/ui/CoinInfo.tsx

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
  };
  market_data?: {
    current_price: {
      usd: number;
    };
  };
  prices?: Array<{ timestamp: number; price: number }>;
};

type CoinProps = {
  coin: Coin;
};

const CoinInfo = ({ coin }: CoinProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">
        {coin.name} ({coin.symbol})
      </h2>
      <img src={coin.image.thumb} alt={coin.name} className="mx-auto mb-1" />
      <p className="text-lg">
        Current Price: ${coin.market_data?.current_price.usd}
      </p>
    </div>
  );
};

export default CoinInfo;
export type { Coin };
