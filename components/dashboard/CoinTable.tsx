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
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface CoinTableProps {
    coins: Coin[];
    loading?: boolean;
}

export function CoinTable({ coins, loading = false }: CoinTableProps) {
    return (
        <div className="w-full border border-border/50 rounded-xl overflow-hidden shadow-premium bg-card">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/30 bg-muted/30">
                            <TableHead className="w-10 pl-4"></TableHead>
                            <TableHead className="w-10 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">#</TableHead>
                            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Coin</TableHead>
                            <TableHead className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Price</TableHead>
                            <TableHead className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">1h</TableHead>
                            <TableHead className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">24h</TableHead>
                            <TableHead className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">7d</TableHead>
                            <TableHead className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Volume</TableHead>
                            <TableHead className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Market Cap</TableHead>
                            <TableHead className="text-right w-32 pr-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">7D Chart</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(10)].map((_, i) => (
                                <TableRow key={i} className="border-b border-border/20">
                                    <TableCell colSpan={10}>
                                        <Skeleton className="h-14 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : coins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-16 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-2xl">📊</span>
                                        <span className="font-medium">No coins found</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            coins.map((coin, index) => (
                                <TableRow
                                    key={coin.id}
                                    className={cn(
                                        "group hover:bg-muted/50 transition-colors h-[60px]",
                                        index !== coins.length - 1 && "border-b border-border/20"
                                    )}
                                >
                                    <TableCell className="pl-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground/30 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                                        >
                                            <Star className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center font-medium text-xs text-muted-foreground tabular-nums">
                                        {coin.market_cap_rank}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/explore/${coin.id}`}
                                            className="flex items-center gap-3 group/link"
                                        >
                                            <Image
                                                src={coin.image}
                                                alt={coin.name}
                                                width={28}
                                                height={28}
                                                className="rounded-full"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-sm whitespace-nowrap group-hover/link:text-primary transition-colors">
                                                    {coin.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                                    {coin.symbol}
                                                </span>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-semibold text-sm tabular-nums">
                                            {formatCurrency(coin.current_price)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right hidden md:table-cell">
                                        <PriceChange
                                            value={coin.price_change_percentage_1h_in_currency || 0}
                                            showIcon={false}
                                            className="text-xs justify-end"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <PriceChange
                                            value={coin.price_change_percentage_24h}
                                            showIcon={false}
                                            className="text-xs justify-end"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right hidden lg:table-cell">
                                        <PriceChange
                                            value={coin.price_change_percentage_7d_in_currency || 0}
                                            showIcon={false}
                                            className="text-xs justify-end"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-xs text-muted-foreground hidden xl:table-cell tabular-nums">
                                        {formatCompactNumber(coin.total_volume)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-xs text-muted-foreground hidden lg:table-cell tabular-nums">
                                        {formatCurrency(coin.market_cap, 0, 0)}
                                    </TableCell>
                                    <TableCell className="text-right pr-4 hidden md:table-cell">
                                        {coin.sparkline_in_7d && (
                                            <div className="flex justify-end">
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
        </div>
    );
}

