"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Search, X, Plus } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { CoinDetail } from "@/lib/api/types";
import Image from "next/image";

interface CoinSearchResult {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
}

interface CoinSelectorProps {
    coins: CoinDetail[];
    onAddCoin: (coin: CoinSearchResult) => void;
    onRemoveCoin: (coinId: string) => void;
    loading: boolean;
}

export function CoinSelector({ coins, onAddCoin, onRemoveCoin, loading }: CoinSelectorProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<CoinSearchResult[]>([]);
    const [searching, setSearching] = React.useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const results = await coinGeckoAPI.search(searchQuery);
            setSearchResults(results.coins?.slice(0, 10) || []);
        } catch (error) {
            console.error("Error searching:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleAddCoin = (coin: CoinSearchResult) => {
        onAddCoin(coin);
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Coins to Compare</CardTitle>
                <CardDescription>
                    Search and add up to 4 cryptocurrencies to compare their metrics
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Search for a coin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        disabled={coins.length >= 4}
                    />
                    <Button onClick={handleSearch} disabled={searching || coins.length >= 4}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {searchResults.map((coin) => (
                            <button
                                key={coin.id}
                                onClick={() => handleAddCoin(coin)}
                                disabled={coins.some((c) => c.id === coin.id) || loading}
                                className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 hover:bg-accent disabled:opacity-50 transition-colors"
                            >
                                <Image
                                    src={coin.thumb}
                                    alt={coin.name}
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                />
                                <span className="text-sm truncate">{coin.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected Coins */}
                {coins.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {coins.map((coin) => (
                            <Badge
                                key={coin.id}
                                variant="secondary"
                                className="flex items-center gap-2 px-3 py-1"
                            >
                                <Image
                                    src={coin.image?.small || ""}
                                    alt={coin.name}
                                    width={16}
                                    height={16}
                                    className="rounded-full"
                                />
                                {coin.name}
                                <button
                                    onClick={() => onRemoveCoin(coin.id)}
                                    className="ml-1 hover:text-red-400"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                        {coins.length < 4 && (
                            <Badge variant="outline" className="text-muted-foreground">
                                <Plus className="h-3 w-3 mr-1" />
                                {4 - coins.length} more
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import React from "react";
