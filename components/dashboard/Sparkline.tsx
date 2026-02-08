"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
    data: number[];
    isPositive: boolean;
}

export function Sparkline({ data, isPositive }: SparklineProps) {
    const chartData = data.map((value, index) => ({ value, index }));

    return (
        <div className="h-10 w-32">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <YAxis hide domain={["auto", "auto"]} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
