"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@/components/Box";
import Toggle from "./components/Toggle";
import Loading from "./loading";
import { Coin } from "@/types";

const Dashboard: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [paginatedCoins, setPaginatedCoins] = useState<Coin[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_COIN_API_KEY;
      const response = await axios.get<Coin[]>(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&x_cg_demo_api_key=${apiKey}`
      );
      console.log("RESPONSE>>>", response.data);
      setCoins(response.data);
      setPaginatedCoins(response.data.slice(0, 100));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("ERROR>>>", error.message);
      } else {
        console.log("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-neutral-950 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="flex flex-col gap-y-2 bg-black h-full">
        <Box className="overflow-y-auto flex-1 h-full">
          <div className="mb-4">
            <Toggle
              coins={search ? filteredCoins : paginatedCoins}
              setSearch={setSearch}
              search={search}
              handleChange={handleChange}
            />
          </div>
        </Box>
      </div>
      <div className="hidden">
        <script
          src={process.env.NEXT_PUBLIC_BOTPRESS_INJECT_URL}
          defer
        ></script>
        <script
          src={process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL}
          defer
        ></script>
      </div>
    </div>
  );
};

export default Dashboard;
