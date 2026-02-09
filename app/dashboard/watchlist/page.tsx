"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Plus } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { Coin } from "@/lib/api/types";
import { PageHeader } from "@/components/PageHeader";
import { CoinSearchDialog } from "@/components/CoinSearchDialog";
import { WatchlistTable } from "./components/WatchlistTable";

interface WatchlistItem {
    coinId: string;
    coinSymbol: string;
    coinName: string;
}

export default function WatchlistPage() {
    const { data: session } = useSession();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [coinData, setCoinData] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(`watchlist-${session?.user?.id}`);
        if (saved) {
            setWatchlist(JSON.parse(saved));
        }
        setLoading(false);
    }, [session?.user?.id]);

    useEffect(() => {
        if (watchlist.length > 0) {
            fetchWatchlistData();
        } else {
            setCoinData([]);
        }
    }, [watchlist]);

    const fetchWatchlistData = async () => {
        try {
            const ids = watchlist.map((item) => item.coinId);
            const data = await coinGeckoAPI.getCoinsMarkets("usd", {
                ids,
                sparkline: false,
                priceChangePercentage: "24h,7d",
            });
            setCoinData(data);
        } catch (error) {
            console.error("Error fetching watchlist data:", error);
        }
    };

    const addToWatchlist = (coin: { id: string; symbol: string; name: string }) => {
        if (watchlist.some((item) => item.coinId === coin.id)) return;

        const newWatchlist = [
            ...watchlist,
            { coinId: coin.id, coinSymbol: coin.symbol, coinName: coin.name },
        ];
        setWatchlist(newWatchlist);
        localStorage.setItem(
            `watchlist-${session?.user?.id}`,
            JSON.stringify(newWatchlist)
        );
        setDialogOpen(false);
    };

    const removeFromWatchlist = (coinId: string) => {
        const newWatchlist = watchlist.filter((item) => item.coinId !== coinId);
        setWatchlist(newWatchlist);
        localStorage.setItem(
            `watchlist-${session?.user?.id}`,
            JSON.stringify(newWatchlist)
        );
    };

    if (loading) {
        return (
            <div className="space-y-6 p-4 lg:p-6">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 lg:p-6">
            <PageHeader
                icon={Star}
                iconColor="text-yellow-500"
                title="Watchlist"
                description="Track your favorite cryptocurrencies"
            >
                <CoinSearchDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSelect={addToWatchlist}
                    selectedIds={watchlist.map((item) => item.coinId)}
                    title="Add to Watchlist"
                    description="Search for a cryptocurrency to add to your watchlist"
                    triggerButton={
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Coin
                        </Button>
                    }
                />
            </PageHeader>

            {watchlist.length === 0 ? (
                <Card className="py-12">
                    <CardContent className="text-center">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
                        <p className="text-muted-foreground mb-4">
                            Add coins to track their prices and performance
                        </p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Coin
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <WatchlistTable coins={coinData} onRemove={removeFromWatchlist} />
            )}
        </div>
    );
}
