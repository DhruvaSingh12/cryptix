import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Grid from "./Grid";
import Button from "@/components/Button";
import CryptoTable from "./Table";
import Search from "./Search"; 
import {FaTable, FaTh} from "react-icons/fa";
import Box from "@/components/Box";
import { Coin } from "@/types";

interface ToggleProps {
  coins: Coin[];
  search: string; 
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Toggle: React.FC<ToggleProps> = ({ coins, search, handleChange, setSearch }) => {
  const [view, setView] = useState<"grid" | "table">("table");

  const handleViewToggle = () => {
    setView((prevView) => (prevView === "grid" ? "table" : "grid"));
  };

  return (
    <div className="w-full text-white bg-black h-full overflow-hidden overflow-y-auto">
      <Box className="flex justify-between rounded-none fixed items-center pt-4 overflow-hidden px-4">
        <div className="flex-grow">
          <Search search={search} handleChange={handleChange} />
        </div>

        <Tooltip title={`Switch to ${view === "grid" ? "Table" : "Grid"} View`}>
          <button
            onClick={handleViewToggle}
            className="hover:bg-gray-300 rounded-lg bg-gray-200 p-[10px] mb-6 hover:cursor-pointer">
            {view === "grid" ? (
              <FaTable className="text-black text-[30px]" />
            ) : (
              <FaTh className="text-black text-[30px]" />
            )}
          </button>
        </Tooltip>
      </Box>

      <div className="overflow-y-auto">
        {view === "grid" ? (
          <div className="flex justify-center items-stretch flex-wrap w-full pt-[100px] gap-4">
            {coins.length > 0 ? (
              coins.map((coin, i) => <Grid coin={coin} key={i} />)
            ) : (
              <div className="text-center">
                <h1>Try searching some other cryptocurrency.</h1>
                <div className="flex justify-center mt-8">
                  <Button text="Clear Search" onClick={() => setSearch("")} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-[100px]">
            {coins.length > 0 ? (
              <CryptoTable coins={coins} />
            ) : (
              <div className="text-center">
                <h1>Try searching some other cryptocurrency.</h1>
                <div className="flex justify-center mt-8">
                  <Button text="Clear Search" onClick={() => setSearch("")} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toggle;