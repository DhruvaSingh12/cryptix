import { toast } from "react-toastify";

export const saveItemsToWatchlist = (
  e: React.MouseEvent<HTMLButtonElement>, 
  id: string
): void => {
  e.preventDefault();

  let watchlist: string[] = JSON.parse(localStorage.getItem("watchlist") || "[]");

  if (!watchlist.includes(id)) {
    watchlist.push(id);  
    toast.success(`${id.charAt(0).toUpperCase() + id.slice(1)} - added to the watchlist`);
  } else {
    toast.error(`${id.charAt(0).toUpperCase() + id.slice(1)} - is already in the watchlist!`);
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
};