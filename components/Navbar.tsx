"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import Image from "next/image";

interface SearchResult {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
}

export function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const results = await coinGeckoAPI.search(query);
            setSearchResults(results.coins?.slice(0, 6) || []);
            setShowResults(true);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const navigateToCoin = (coinId: string) => {
        router.push(`/dashboard/explore/${coinId}`);
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
    };

    const handleBlur = (e: React.FocusEvent) => {
        // Only hide if focus moves outside the container
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setShowResults(false);
        }
    };

    return (
        <div className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div
                    ref={containerRef}
                    className="relative flex-1 max-w-md"
                    onBlur={handleBlur}
                >
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search coins..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                        className="pl-10 bg-muted/50"
                    />

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                            {searchResults.map((coin) => (
                                <button
                                    key={coin.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        navigateToCoin(coin.id);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                                >
                                    <Image
                                        src={coin.thumb}
                                        alt={coin.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium text-sm">{coin.name}</div>
                                        <div className="text-xs text-muted-foreground uppercase">
                                            {coin.symbol}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications (for future use) */}
                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                                    3
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="p-3 border-b border-border">
                                <h4 className="font-semibold">Notifications</h4>
                            </div>
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                <span className="font-medium text-sm">BTC reached $100K! 🚀</span>
                                <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                <span className="font-medium text-sm">ETH up 5% today</span>
                                <span className="text-xs text-muted-foreground">4 hours ago</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                                <span className="font-medium text-sm">Watchlist alert: SOL +10%</span>
                                <span className="text-xs text-muted-foreground">Yesterday</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
