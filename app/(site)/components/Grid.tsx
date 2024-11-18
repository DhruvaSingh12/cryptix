import React, { useState } from "react";
import { removeItemsFromWatchlist } from "@/actions/removeItemsFromWatchlist";
import { saveItemsToWatchlist } from "@/actions/saveItemsToWatchlist";
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { Coin } from "@/types";

interface GridProps {
  coin: Coin;
}

const Grid: React.FC<GridProps> = ({ coin }) => {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  const [isCoinAdded, setIsCoinAdded] = useState(watchlist?.includes(coin.id));

  return (
    <a href={`/coin/${coin.id}`}>
      <div
        className={`flex flex-col gap-y-2 w-[180px] sm:w-[200px] md:w-[240px] lg:w-[275px] p-3 md:p-4 rounded-lg cursor-pointer ${
          coin.price_change_percentage_24h < 0
            ? "bg-red-300 hover:bg-red-400"
            : "bg-green-300 hover:bg-green-400"
        }`}
      >
        {/* Coin Image and Name */}
        <div className="flex justify-start items-center gap-y-2 gap-x-4">
          <img
            src={coin.image}
            className="h-[40px] w-[40px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] lg:h-[60px] lg:w-[60px] rounded-full"
            alt={coin.name}
          />
          <div className="flex flex-col gap-[2px] w-full">
            <p className="text-[14px] sm:text-[15px] md:text-[18px] font-semibold text-black truncate">
              {coin.name.length > (window.innerWidth >= 768 ? 17 : 12)
                ? `${coin.name.slice(0, window.innerWidth >= 768 ? 17 : 12)}..`
                : coin.name}
            </p>
            <p className="uppercase text-gray-800 text-[12px] sm:text-[14px] font-bold">
              {coin.symbol}
            </p>
          </div>
        </div>

        {/* Price and Change Percentage */}
        <div className="flex items-center gap-2">
          <p
            className={`font-semibold w-[50%] text-[14px] sm:text-[16px] md:text-[18px] ${
              coin.price_change_percentage_24h >= 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            ${coin.current_price.toLocaleString()}
          </p>
          <div
            className={`border-2 rounded-md w-[40%] px-1 sm:px-2 py-1 font-semibold text-[12px] sm:text-[14px] md:text-[16px] ${
              coin.price_change_percentage_24h >= 0
                ? "border-green-700 text-green-700"
                : "border-red-700 text-red-700"
            }`}
          >
            {coin.price_change_percentage_24h.toFixed(2)}%
          </div>
          <button
            className={`p-1 rounded-full flex w-[20%] items-center justify-center ${
              coin.price_change_percentage_24h < 0
                ? "text-red-700"
                : "text-green-700"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (isCoinAdded) {
                removeItemsFromWatchlist(e, coin.id, setIsCoinAdded);
              } else {
                setIsCoinAdded(true);
                saveItemsToWatchlist(e, coin.id);
              }
            }}
          >
            {isCoinAdded ? (
              <FaCheckCircle size={22}/>
            ) : (
              <FaPlusCircle size={22}/>
            )}
          </button>
        </div>

        {/* Additional Info (Total Volume and Market Cap) */}
        <div className="hidden sm:flex flex-col md:flex-row gap-x-2">
          <div className="flex flex-col md:flex-row gap-x-2">
            <p className="text-gray-800 font-bold text-[12px] sm:text-[14px]">Tot. Vol.</p>
            <p className="text-black font-semibold text-[12px] sm:text-[15px]">
              {coin.total_volume.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col md:flex-row gap-x-2">
          <div className="flex flex-col md:flex-row gap-x-2">
            <p className="text-gray-800 font-bold text-[12px] sm:text-[14px]">Market Cap.</p>
            <p className="text-black font-semibold text-[12px] sm:text-[15px]">
              ${coin.market_cap.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default Grid;
