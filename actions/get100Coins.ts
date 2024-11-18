import axios from "axios";

export const get100Coins = async (): Promise<any[]> => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10000&page=1&sparkline=false"
    );
    console.log("RESPONSE>>>", response.data);
    return response.data;
  } catch (error: any) {
    console.log("ERROR>>>", error.message);
    return [];
  }
};
