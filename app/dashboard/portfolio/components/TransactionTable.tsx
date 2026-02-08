"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export interface Transaction {
    id: string;
    coinId: string;
    coinSymbol: string;
    coinName: string;
    coinImage: string;
    type: "BUY" | "SELL";
    amount: number;
    pricePerCoin: number;
    date: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onDelete: (transactionId: string) => void;
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Add your first transaction above.
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Image
                                    src={t.coinImage}
                                    alt={t.coinName}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                                <span className="uppercase">{t.coinSymbol}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span
                                className={
                                    t.type === "BUY" ? "text-green-500" : "text-red-500"
                                }
                            >
                                {t.type}
                            </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            {t.amount}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            ${t.pricePerCoin.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            ${(t.amount * t.pricePerCoin).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{t.date}</TableCell>
                        <TableCell>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(t.id)}
                                className="text-red-500"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
