import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PieChart, TrendingUp, TrendingDown } from "lucide-react";

interface PortfolioSummaryCardsProps {
    totalValue: number;
    totalCost: number;
    profitLoss: number;
}

export function PortfolioSummaryCards({ totalValue, totalCost, profitLoss }: PortfolioSummaryCardsProps) {
    const formatCurrency = (value: number) => {
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total Value
                    </CardDescription>
                    <CardTitle className="text-2xl">
                        ${formatCurrency(totalValue)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Total Cost
                    </CardDescription>
                    <CardTitle className="text-2xl">
                        ${formatCurrency(totalCost)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Profit/Loss</CardDescription>
                    <CardTitle
                        className={`text-2xl flex items-center gap-2 ${profitLoss >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {profitLoss >= 0 ? (
                            <TrendingUp className="h-5 w-5" />
                        ) : (
                            <TrendingDown className="h-5 w-5" />
                        )}
                        ${formatCurrency(Math.abs(profitLoss))}
                        {totalCost > 0 && (
                            <span className="text-sm">
                                ({((profitLoss / totalCost) * 100).toFixed(2)}%)
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
