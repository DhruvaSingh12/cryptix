"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Star } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import Image from "next/image";

interface CoinResult {
    id: string;
    symbol: string;
    name: string;
    thumb: string;
}

interface CoinSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (coin: CoinResult) => void;
    selectedIds?: string[];
    triggerButton?: React.ReactNode;
    title?: string;
    description?: string;
}

export function CoinSearchDialog({
    open,
    onOpenChange,
    onSelect,
    selectedIds = [],
    triggerButton,
    title = "Search Coins",
    description = "Search for a cryptocurrency",
}: CoinSearchDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<CoinResult[]>([]);
    const [searching, setSearching] = useState(false);

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

    const handleSelect = (coin: CoinResult) => {
        onSelect(coin);
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search coins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={searching} size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {searching ? (
                            <div className="text-center text-muted-foreground py-4">
                                Searching...
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => handleSelect(coin)}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                    disabled={selectedIds.includes(coin.id)}
                                >
                                    <Image
                                        src={coin.thumb}
                                        alt={coin.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <div className="text-left">
                                        <div className="font-medium">{coin.name}</div>
                                        <div className="text-xs text-muted-foreground uppercase">
                                            {coin.symbol}
                                        </div>
                                    </div>
                                    {selectedIds.includes(coin.id) && (
                                        <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                                    )}
                                </button>
                            ))
                        ) : searchQuery ? (
                            <div className="text-center text-muted-foreground py-4">
                                No results found
                            </div>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
