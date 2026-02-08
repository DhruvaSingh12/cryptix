"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TrendingCoin {
    item: {
        id: string;
        coin_id: number;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        large: string;
        slug: string;
        price_btc: number;
        score: number;
    };
}

interface TrendingCoinCardProps {
    coin: TrendingCoin;
    index: number;
}

export function TrendingCoinCard({ coin, index }: TrendingCoinCardProps) {
    return (
        <Link href={`/dashboard/explore/${coin.item.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src={coin.item.large}
                                    alt={coin.item.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <Badge
                                    variant="secondary"
                                    className="absolute -top-2 -left-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    {index + 1}
                                </Badge>
                            </div>
                            <div>
                                <CardTitle className="text-lg">{coin.item.name}</CardTitle>
                                <p className="text-sm text-muted-foreground uppercase">
                                    {coin.item.symbol}
                                </p>
                            </div>
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Market Cap Rank</span>
                        <span className="font-mono">
                            #{coin.item.market_cap_rank || "N/A"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Price (BTC)</span>
                        <span className="font-mono text-orange-400">
                            {coin.item.price_btc.toFixed(8)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
