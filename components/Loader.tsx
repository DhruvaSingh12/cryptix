import { CircularProgress } from "@mui/material";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black z-50">
      <CircularProgress />
    </div>
  );
};

export default Loader;
