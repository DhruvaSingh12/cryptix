"use client";

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
import { Sparkline } from "@/components/dashboard/Sparkline";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatCompactNumber, formatPercentage } from "@/lib/utils/format";

interface CoinTableProps {
    coins: Coin[];
    loading?: boolean;
}

export function CoinTable({ coins, loading = false }: CoinTableProps) {

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                        <TableHead className="w-10 pl-4"></TableHead>
                        <TableHead className="w-12 text-center text-xs font-bold text-foreground">#</TableHead>
                        <TableHead className="text-xs font-bold text-foreground">Coin</TableHead>
                        <TableHead className="text-right text-xs font-bold text-foreground">Price</TableHead>
                        <TableHead className="text-right text-xs font-bold text-foreground">1h</TableHead>
                        <TableHead className="text-right text-xs font-bold text-foreground">24h</TableHead>
                        <TableHead className="text-right text-xs font-bold text-foreground">7d</TableHead>
                        <TableHead className="text-right text-xs font-bold text-foreground">24h Volume</TableHead>
                        <TableHead className="text-right text-xs font-bold text-foreground">Market Cap</TableHead>
                        <TableHead className="text-right w-40 pr-6 text-xs font-bold text-foreground">Last 7 Days</TableHead>
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
                            <TableRow key={coin.id} className="group hover:bg-muted/50 transition-colors border-b border-border/50 h-[64px]">
                                <TableCell className="pl-4">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/30 hover:text-yellow-500 transition-colors">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center font-medium text-xs text-muted-foreground">
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
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold whitespace-nowrap text-sm group-hover/link:text-primary transition-colors">{coin.name}</span>
                                                <span className="text-[11px] font-bold text-muted-foreground/70 uppercase">
                                                    {coin.symbol}
                                                </span>
                                            </div>
                                        </Link>
                                        {(coin.symbol === "btc" || coin.symbol === "eth") && (
                                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-500 bg-emerald-500/5 font-bold uppercase tracking-tighter ml-1">
                                                Buy
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-sm">
                                    {formatCurrency(coin.current_price)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceChange
                                        value={coin.price_change_percentage_1h_in_currency || 0}
                                        showIcon={true}
                                        className="text-xs font-bold"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceChange
                                        value={coin.price_change_percentage_24h}
                                        showIcon={true}
                                        className="text-xs font-bold"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceChange
                                        value={coin.price_change_percentage_7d_in_currency || 0}
                                        showIcon={true}
                                        className="text-xs font-bold"
                                    />
                                </TableCell>
                                <TableCell className="text-right font-medium text-xs text-foreground">
                                    {formatCompactNumber(coin.total_volume)}
                                </TableCell>
                                <TableCell className="text-right font-medium text-xs text-foreground">
                                    {formatCurrency(coin.market_cap, 0, 0)}
                                </TableCell>
                                <TableCell className="text-right pr-6">
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
        </div>
    );
}
