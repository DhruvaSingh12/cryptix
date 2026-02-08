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
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Exchange } from "@/lib/api/types";
import Image from "next/image";

interface ExchangeTableProps {
    exchanges: Exchange[];
    loading: boolean;
}

export function ExchangeTable({ exchanges, loading }: ExchangeTableProps) {
    const getTrustScoreColor = (score: number) => {
        if (score >= 8) return "bg-green-500";
        if (score >= 5) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Exchange</TableHead>
                        <TableHead className="text-center">Trust Score</TableHead>
                        <TableHead className="text-right">24h Volume (BTC)</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        [...Array(10)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={6}>
                                    <Skeleton className="h-12 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        exchanges.map((exchange) => (
                            <TableRow key={exchange.id} className="hover:bg-accent">
                                <TableCell className="font-medium">
                                    {exchange.trust_score_rank}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {exchange.image && (
                                            <Image
                                                src={exchange.image}
                                                alt={exchange.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium">{exchange.name}</div>
                                            {exchange.year_established && (
                                                <div className="text-xs text-muted-foreground">
                                                    Est. {exchange.year_established}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={`${getTrustScoreColor(exchange.trust_score || 0)}`}
                                    >
                                        {exchange.trust_score || "N/A"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {exchange.trade_volume_24h_btc_normalized?.toLocaleString(
                                        undefined,
                                        { maximumFractionDigits: 0 }
                                    ) || "N/A"}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {exchange.country || "Unknown"}
                                </TableCell>
                                <TableCell>
                                    {exchange.url && (
                                        <a
                                            href={exchange.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
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
