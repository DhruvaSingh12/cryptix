"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Coin } from "@/lib/api/types";
import { PriceChange } from "@/components/PriceChange";
import { Sparkline } from "./Sparkline";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface CoinTableProps {
    coins: Coin[];
    loading?: boolean;
}

export function CoinTable({ coins, loading = false }: CoinTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatLargeNumber = (value: number) => {
        if (!value) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Coin</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right font-semibold">1h</TableHead>
                        <TableHead className="text-right font-semibold">24h</TableHead>
                        <TableHead className="text-right font-semibold">7d</TableHead>
                        <TableHead className="text-right font-semibold">24h Volume</TableHead>
                        <TableHead className="text-right font-semibold">Market Cap</TableHead>
                        <TableHead className="text-right w-40">Last 7 Days</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        [...Array(10)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={10}>
                                    <Skeleton className="h-16 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : coins.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-10 text-muted-foreground font-medium">
                                No coins found
                            </TableCell>
                        </TableRow>
                    ) : (
                        coins.map((coin) => (
                            <TableRow key={coin.id} className="group hover:bg-accent/50 transition-colors border-b border-border/50 h-[72px]">
                                <TableCell className="px-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/30 hover:text-yellow-500 transition-colors">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center font-medium text-muted-foreground/80">
                                    {coin.market_cap_rank}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/dashboard/explore/${coin.id}`}
                                            className="flex items-center gap-3 group/link"
                                        >
                                            <Image
                                                src={coin.image}
                                                alt={coin.name}
                                                width={26}
                                                height={26}
                                                className="rounded-full shadow-sm"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold whitespace-nowrap group-hover/link:text-primary transition-colors">{coin.name}</span>
                                                <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                                                    {coin.symbol}
                                                </span>
                                            </div>
                                        </Link>
                                        {(coin.symbol === "btc" || coin.symbol === "eth") && (
                                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-500 bg-emerald-500/5 font-bold uppercase tracking-tighter">
                                                Buy
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-[14px]">
                                    {formatCurrency(coin.current_price)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceChange
                                        value={coin.price_change_percentage_1h_in_currency || 0}
                                        showIcon={true}
                                        className="text-[13px] font-bold"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceChange
                                        value={coin.price_change_percentage_24h}
                                        showIcon={true}
                                        className="text-[13px] font-bold"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceChange
                                        value={coin.price_change_percentage_7d_in_currency || 0}
                                        showIcon={true}
                                        className="text-[13px] font-bold"
                                    />
                                </TableCell>
                                <TableCell className="text-right font-semibold text-muted-foreground/80 text-[13px]">
                                    {formatLargeNumber(coin.total_volume)}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-muted-foreground/80 text-[13px]">
                                    {formatLargeNumber(coin.market_cap)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {coin.sparkline_in_7d && (
                                        <div className="flex justify-end p-1">
                                            <Sparkline
                                                data={coin.sparkline_in_7d.price}
                                                isPositive={(coin.price_change_percentage_7d_in_currency || 0) >= 0}
                                            />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
