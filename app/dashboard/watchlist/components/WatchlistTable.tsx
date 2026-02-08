"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Coin } from "@/lib/api/types";
import { PriceChange } from "@/components/PriceChange";
import Image from "next/image";
import Link from "next/link";

interface WatchlistTableProps {
    coins: Coin[];
    onRemove: (coinId: string) => void;
}

export function WatchlistTable({ coins, onRemove }: WatchlistTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: value < 1 ? 6 : 2,
        }).format(value);
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Coin</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">24h Change</TableHead>
                        <TableHead className="text-right">7d Change</TableHead>
                        <TableHead className="text-right">Market Cap</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coins.map((coin) => (
                        <TableRow key={coin.id} className="hover:bg-accent">
                            <TableCell>
                                <Link
                                    href={`/dashboard/explore/${coin.id}`}
                                    className="flex items-center gap-3 hover:text-foreground"
                                >
                                    <Image
                                        src={coin.image}
                                        alt={coin.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium">{coin.name}</div>
                                        <div className="text-sm text-muted-foreground uppercase">
                                            {coin.symbol}
                                        </div>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {formatCurrency(coin.current_price)}
                            </TableCell>
                            <TableCell className="text-right">
                                <PriceChange value={coin.price_change_percentage_24h} />
                            </TableCell>
                            <TableCell className="text-right">
                                <PriceChange
                                    value={coin.price_change_percentage_7d_in_currency || 0}
                                    showIcon={false}
                                />
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                ${(coin.market_cap / 1e9).toFixed(2)}B
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemove(coin.id)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
