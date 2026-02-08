"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { Coin } from "@/lib/api/types";
import { PageHeader } from "@/components/PageHeader";
import { CoinTable } from "./components/CoinTable";

export default function ExplorePage() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("market_cap_desc");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchCoins();
    }, [sortBy, page]);

    const fetchCoins = async () => {
        setLoading(true);
        try {
            const data = await coinGeckoAPI.getCoinsMarkets("usd", {
                order: sortBy,
                perPage: 50,
                page,
                sparkline: true,
                priceChangePercentage: "1h,24h,7d",
            });
            setCoins(data);
        } catch (error) {
            console.error("Error fetching coins:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCoins = coins.filter(
        (coin) =>
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Search}
                iconColor="text-blue-500"
                title="Explore Cryptocurrencies"
                description="Discover and analyze thousands of cryptocurrencies"
            />

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search coins..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
                            <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
                            <SelectItem value="volume_desc">Volume (High to Low)</SelectItem>
                            <SelectItem value="volume_asc">Volume (Low to High)</SelectItem>
                            <SelectItem value="id_desc">Recently Added</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Coins Table */}
            <CoinTable coins={filteredCoins} loading={loading} />

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
