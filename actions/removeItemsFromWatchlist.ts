import { toast } from "react-toastify";

export const removeItemsFromWatchlist = (
    e: React.MouseEvent<HTMLButtonElement>, 
    id: string, 
    setIsCoinAdded: (value: boolean) => void
  ): void => {
    e.preventDefault();
  
    if (window.confirm("Are you sure you want to remove this coin?")) {
      let watchlist: string[] = JSON.parse(localStorage.getItem("watchlist") || "[]");
  
      const newList = watchlist.filter((coin: string) => coin !== id);
  
      setIsCoinAdded(false);
      localStorage.setItem("watchlist", JSON.stringify(newList));
  
      toast.success(`${id.charAt(0).toUpperCase() + id.slice(1)} - has been removed!`);
      
    } else {
      toast.error(`${id.charAt(0).toUpperCase() + id.slice(1)} - could not be removed!`);
      setIsCoinAdded(true);
    }
  };