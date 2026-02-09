"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="grid gap-4 lg:grid-cols-2">
            {/* Trending */}
            <Card className="border border-border/50 shadow-premium bg-card overflow-hidden hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/30">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Flame className="h-4 w-4 text-orange-500" />
                        </div>
                        <CardTitle className="text-sm font-semibold">Trending</CardTitle>
                    </div>
                    <Link href="/dashboard/trending" className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
                        View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    {trending.slice(0, 4).map((coin, idx) => (
                        <Link
                            key={coin.item.id}
                            href={`/dashboard/explore/${coin.item.id}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-muted-foreground/60 w-4 tabular-nums">{idx + 1}</span>
                                <Image src={coin.item.thumb} alt={coin.item.name} width={32} height={32} className="rounded-full" />
                                <div>
                                    <span className="text-sm font-semibold block">{coin.item.name}</span>
                                    <span className="text-[11px] text-muted-foreground uppercase">{coin.item.symbol}</span>
                                </div>
                            </div>
                            <PriceChange value={coin.item.data?.price_change_percentage_24h?.usd || 0} className="text-xs font-semibold" />
                        </Link>
                    ))}
                </CardContent>
            </Card>

            {/* Top Gainers */}
            <Card className="border border-border/50 shadow-premium bg-card overflow-hidden hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/30">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Rocket className="h-4 w-4 text-emerald-500" />
                        </div>
                        <CardTitle className="text-sm font-semibold">Top Gainers</CardTitle>
                    </div>
                    <Link href="/dashboard/explore" className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
                        View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    {gainers.slice(0, 4).map((coin, idx) => (
                        <Link
                            key={coin.id}
                            href={`/dashboard/explore/${coin.id}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-muted-foreground/60 w-4 tabular-nums">{idx + 1}</span>
                                <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" />
                                <div>
                                    <span className="text-sm font-semibold block">{coin.name}</span>
                                    <span className="text-[11px] text-muted-foreground uppercase">{coin.symbol}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold tabular-nums block">${coin.current_price.toLocaleString()}</span>
                                <PriceChange value={coin.price_change_percentage_24h} showIcon={false} className="text-xs font-semibold" />
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

