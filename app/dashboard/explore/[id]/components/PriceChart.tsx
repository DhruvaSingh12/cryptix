"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketChart } from "@/lib/api/types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
    chartData: MarketChart | null;
    chartDays: string;
    onChartDaysChange: (days: string) => void;
    isPositive: boolean;
    formatPrice: (price: number) => string;
}

export function PriceChart({
    chartData,
    chartDays,
    onChartDaysChange,
    isPositive,
    formatPrice,
}: PriceChartProps) {
    const priceChartData = chartData?.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price,
    })) || [];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Price Chart</CardTitle>
                    <div className="flex gap-2">
                        {["1", "7", "30", "90", "365"].map((days) => (
                            <Button
                                key={days}
                                variant={chartDays === days ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => onChartDaysChange(days)}
                            >
                                {days === "1" ? "24h" : days === "365" ? "1Y" : `${days}D`}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceChartData}>
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "#888", fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#888", fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                                domain={["auto", "auto"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#1a1a1a",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#fff" }}
                                formatter={(value) => formatPrice(Number(value) || 0)}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke={isPositive ? "#22c55e" : "#ef4444"}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
