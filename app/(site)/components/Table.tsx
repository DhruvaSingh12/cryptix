import React, { useState, useEffect } from "react";
import { Coin } from "@/types";
import { FaCheckCircle, FaEllipsisV, FaPlusCircle } from "react-icons/fa";

interface TableProps {
  coins: Coin[];
}

type SortOrder = "asc" | "desc";

const CryptoTable: React.FC<TableProps> = ({ coins }) => {
  const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("market_cap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [watchlist, setWatchlist] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setSortField("market_cap");
    setSortOrder("desc");
  }, []);

  const handleExpand = (coinId: string) => {
    setExpandedCoin(expandedCoin === coinId ? null : coinId);
  };

  const sortedCoins = [...coins].sort((a, b) => {
    const fieldA = a[sortField as keyof Coin];
    const fieldB = b[sortField as keyof Coin];

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }
    return 0;
  });

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const renderArrow = (field: string) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "↓↑";
  };

  const handleWatchlist = (coinId: string) => {
    setWatchlist((prev) => ({
      ...prev,
      [coinId]: !prev[coinId],
    }));
  };

  return (
    <div className="w-full px-2 md:px-4">
      {/* Table */}
      <div className="hidden overflow-x-hidden md:block">
        <div className="flex bg-gradient-to-r from-rose-500 via-violet-400 to-pink-400 text-blue-950 mb-3 rounded-lg">
          <div className="py-3 px-3 text-base font-semibold w-[4.1667%]" />
          <div className="py-3 px-3 text-base font-semibold w-[16.6664%]">
            Coin
          </div>
          <div
            className="py-3 px-2 text-base font-semibold cursor-pointer w-[10.41667%]"
            onClick={() => handleSort("current_price")}
          >
            Price {renderArrow("current_price")}
          </div>
          <div
            className="py-3 px-3 text-base font-semibold cursor-pointer w-[25.52%]"
            onClick={() => handleSort("market_cap")}
          >
            Market Cap {renderArrow("market_cap")}
          </div>
          <div
            className="py-3 px-3 text-base font-semibold cursor-pointer w-[25.52%]"
            onClick={() => handleSort("total_volume")}
          >
            Volume (24h) {renderArrow("total_volume")}
          </div>
          <div
            className="py-3 px-3 text-base font-semibold cursor-pointer w-[9.3744%]"
            onClick={() => handleSort("price_change_percentage_24h")}
          >
            % {renderArrow("price_change_percentage_24h")}
          </div>
          <div className="pb-3 pt-1 px-3 text-3xl font-semibold w-[3.1667%]">
            +
          </div>
          <div className="py-3 px-3 text-base font-semibold w-[5.1667%]" />
        </div>

        {sortedCoins.map((coin, index) => (
          <div key={coin.id}>
            <div
              className={`flex rounded-lg mb-2 transition-all duration-300 ${
                coin.price_change_percentage_24h > 0
                  ? "bg-neutral-400 hover:bg-green-400"
                  : "bg-neutral-400 hover:bg-red-400"
              }`}
            >
              <div className="py-3 px-3 text-lg font-medium text-gray-900 w-[4.1667%]">
                {index + 1}
              </div>
              <div className="py-3 px-3 text-lg text-gray-900 w-[16.6664%]">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="inline-block w-10 h-10 mr-2"
                />
                {coin.name} ({coin.symbol.toUpperCase()})
              </div>
              <div className="py-3 px-3 text-lg text-gray-900 w-[10.41667%]">
                $
                {coin.current_price?.toLocaleString() ||
                  "[Price not available]"}
              </div>
              <div className="py-3 px-3 text-lg text-gray-900 w-[25.52%]">
                $
                {coin.market_cap?.toLocaleString() ||
                  "[Market cap not available]"}
              </div>
              <div className="py-3 px-3 text-lg text-gray-900 w-[25.52%]">
                $
                {coin.total_volume?.toLocaleString() ||
                  "[Volume not available]"}
              </div>
              <div
                className={`py-3 px-3 font-bold text-lg ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-800"
                    : "text-red-800"
                } w-[9.3744%]`}
              >
                {coin.price_change_percentage_24h?.toFixed(2) || "[N/A]"}%
              </div>
              <div className="py-3 px-3 text-center text-gray-700 w-[3.1667%]">
                <button onClick={() => handleWatchlist(coin.id)}>
                  {watchlist[coin.id] ? (
                    <FaCheckCircle size={24} />
                  ) : (
                    <FaPlusCircle size={24} />
                  )}
                </button>
              </div>
              <div className="py-3 px-3 mt-1 text-gray-700 text-center w-[5.1667%]">
                <button onClick={() => handleExpand(coin.id)}>
                  <FaEllipsisV size={16} />
                </button>
              </div>
            </div>

            {/* Expanded content */}
            {expandedCoin === coin.id && (
              <div className="bg-gray-300 text-black p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  <div>
                    <strong>Circulating Supply:</strong>{" "}
                    {coin.circulating_supply?.toLocaleString() || "[N/A]"}
                  </div>
                  <div>
                    <strong>Max Supply:</strong>{" "}
                    {coin.total_supply?.toLocaleString() || "[N/A]"}
                  </div>
                  <div>
                    <strong>ATH:</strong> $
                    {coin.ath?.toLocaleString() || "[N/A]"} (
                    {coin.ath_change_percentage?.toFixed(2)}% from ATH)
                  </div>
                  <div>
                    <strong>ATL:</strong> $
                    {coin.atl?.toLocaleString() || "[N/A]"} (
                    {coin.atl_change_percentage?.toFixed(2)}% from ATL)
                  </div>
                  <div>
                    <strong>Market Cap Rank:</strong>{" "}
                    {coin.market_cap_rank || "[N/A]"}
                  </div>
                  <div>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(coin.last_updated).toLocaleString() || "[N/A]"}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="md:hidden grid gap-2 mt-4">
        {sortedCoins.map((coin, index) => (
          <div
            key={coin.id}
            className="bg-gray-300 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-gray-900">
                {index + 1}.
              </div>
              <div className="text-lg font-semibold text-black">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="inline-block w-8 h-8 mr-2"
                />
                {coin.name} ({coin.symbol.toUpperCase()})
              </div>
            </div>
            <div className="mt-2 text-black text-[18px]">
              <div>
                <strong>Price:</strong> $
                {coin.current_price?.toLocaleString() ||
                  "[Price not available]"}
              </div>
              <div>
                <strong>Market Cap:</strong> $
                {coin.market_cap?.toLocaleString() ||
                  "[Market cap not available]"}
              </div>
              <div>
                <strong>Volume (24h):</strong> $
                {coin.total_volume?.toLocaleString() ||
                  "[Volume not available]"}
              </div>
              <div
                className={`mt-1 ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <strong>Change (24h):</strong>{" "}
                {coin.price_change_percentage_24h?.toFixed(2) || "[N/A]"}%
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <button
                className="text-black"
                onClick={() => handleWatchlist(coin.id)}
              >
                {watchlist[coin.id] ? (
                  <FaCheckCircle size={30} />
                ) : (
                  <FaPlusCircle size={30} />
                )}
              </button>
              <button
                className="text-black"
                onClick={() => handleExpand(coin.id)}
              >
                <FaEllipsisV />
              </button>
            </div>

            {expandedCoin === coin.id && (
              <div
                className={`rounded-lg mb-2 text-gray-800 p-3 mt-3 transition-all duration-300 ${
                coin.price_change_percentage_24h > 0
                  ? "bg-gray-200 hover:bg-green-400"
                  : "bg-gray-200 hover:bg-red-400"
              }`}>
                <div>
                  <strong>Circulating Supply:</strong>{" "}
                  {coin.circulating_supply?.toLocaleString() || "[N/A]"}
                </div>
                <div>
                  <strong>Max Supply:</strong>{" "}
                  {coin.total_supply?.toLocaleString() || "[N/A]"}
                </div>
                <div>
                  <strong>ATH:</strong> ${coin.ath?.toLocaleString() || "[N/A]"}{" "}
                  ({coin.ath_change_percentage?.toFixed(2)}% from ATH)
                </div>
                <div>
                  <strong>ATL:</strong> ${coin.atl?.toLocaleString() || "[N/A]"}{" "}
                  ({coin.atl_change_percentage?.toFixed(2)}% from ATL)
                </div>
                <div>
                  <strong>Market Cap Rank:</strong>{" "}
                  {coin.market_cap_rank || "[N/A]"}
                </div>
                <div>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(coin.last_updated).toLocaleString() || "[N/A]"}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoTable;
