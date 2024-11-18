import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void; 
  outlined?: boolean; 
}

const Button: React.FC<ButtonProps> = ({ text, onClick, outlined }) => {
  const baseStyles = "py-2 px-6 rounded-full font-semibold text-sm capitalize cursor-pointer min-w-[80px] transition-all duration-300";
  const outlinedStyles = "bg-black border-2 border-blue-600 text-white hover:bg-blue-600";
  const filledStyles = "bg-blue-600 border-2 border-blue-600 text-white hover:shadow-lg";

  return (
    <div
      className={`${baseStyles} ${outlined ? outlinedStyles : filledStyles}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Button;
