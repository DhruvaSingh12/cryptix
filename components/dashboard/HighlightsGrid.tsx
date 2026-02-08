"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Rocket, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceChange } from "@/components/PriceChange";

interface HighlightsGridProps {
    trending: any[];
    gainers: any[];
}

export function HighlightsGrid({ trending, gainers }: HighlightsGridProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Trending */}
            <Card className="border-none shadow-sm bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
                        <CardTitle className="text-base font-bold">Trending</CardTitle>
                    </div>
                    <Link href="/dashboard/trending" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                        View more <ChevronRight className="h-3 w-3" />
                    </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                    {trending.slice(0, 3).map((coin, idx) => (
                        <Link key={coin.item.id} href={`/dashboard/explore/${coin.item.id}`} className="flex items-center justify-between group hover:bg-accent/50 p-2 rounded-lg -mx-2 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                                <Image src={coin.item.thumb} alt={coin.item.name} width={28} height={28} className="rounded-full" />
                                <span className="text-sm font-bold group-hover:text-primary transition-colors">{coin.item.name}</span>
                                <span className="text-xs text-muted-foreground font-medium uppercase">{coin.item.symbol}</span>
                            </div>
                            <div className="text-right">
                                <PriceChange value={coin.item.data?.price_change_percentage_24h?.usd || 0} className="text-xs font-bold" />
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>

            {/* Top Gainers */}
            <Card className="border-none shadow-sm bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                        <CardTitle className="text-base font-bold">Top Gainers</CardTitle>
                    </div>
                    <Link href="/dashboard/explore" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                        View more <ChevronRight className="h-3 w-3" />
                    </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                    {gainers.slice(0, 3).map((coin, idx) => (
                        <Link key={coin.id} href={`/dashboard/explore/${coin.id}`} className="flex items-center justify-between group hover:bg-accent/50 p-2 rounded-lg -mx-2 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                                <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" />
                                <span className="text-sm font-bold group-hover:text-primary transition-colors">{coin.name}</span>
                                <span className="text-xs text-muted-foreground font-medium uppercase">{coin.symbol}</span>
                            </div>
                            <div className="text-right flex flex-col items-end gap-0.5">
                                <span className="text-sm font-bold">${coin.current_price.toLocaleString()}</span>
                                <PriceChange value={coin.price_change_percentage_24h} className="text-xs font-bold" />
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
