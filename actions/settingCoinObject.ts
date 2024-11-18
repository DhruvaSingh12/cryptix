interface CoinData {
    id: string;
    name: string;
    symbol: string;
    image: {
      large: string;
    };
    description: {
      en: string;
    };
    market_data: {
      price_change_percentage_24h: number;
      total_volume: {
        usd: number;
      };
      current_price: {
        usd: number;
      };
      market_cap: {
        usd: number;
      };
    };
  }
  
  interface CoinObject {
    id: string;
    name: string;
    symbol: string;
    image: string;
    desc: string;
    price_change_percentage_24h: number;
    total_volume: number;
    current_price: number;
    market_cap: number;
  }
  
  export const settingCoinObject = (data: CoinData, setCoin: (coin: CoinObject) => void): void => {
    setCoin({
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image.large,
      desc: data.description.en,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      total_volume: data.market_data.total_volume.usd,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
    });
  };
  