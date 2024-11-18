import axios from "axios";

export const getCoinData = async (
  id: string, 
  setError?: (value: boolean) => void
): Promise<any | null> => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (e: any) {
    console.log(e.message);
    if (setError) {
      setError(true);
    }
    return null;
  }
};
