"use client";

import { Activity, Zap, TrendingUp, BarChart3, Binary, Gauge } from "lucide-react";

interface GlobalStatsBarProps {
    data: any;
}

export function GlobalStatsBar({ data }: GlobalStatsBarProps) {
    if (!data) return null;

    const formatCurrency = (value: number) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        return `$${(value / 1e6).toFixed(2)}M`;
    };

    const stats = [
        { label: "Coins", value: data.active_cryptocurrencies.toLocaleString(), icon: Binary },
        { label: "Markets", value: data.markets.toLocaleString(), icon: BarChart3 },
        {
            label: "Market Cap",
            value: formatCurrency(data.total_market_cap.usd),
            change: data.market_cap_change_percentage_24h_usd,
            icon: Activity
        },
        { label: "24h Volume", value: formatCurrency(data.total_volume.usd), icon: Zap },
        { label: "BTC", value: `${data.market_cap_percentage.btc.toFixed(1)}%`, icon: TrendingUp, subLabel: "Dominance" },
        { label: "ETH", value: `${data.market_cap_percentage.eth.toFixed(1)}%`, icon: TrendingUp, subLabel: "Dominance" },
    ];

    return (
        <div className="w-full bg-card/80 backdrop-blur-sm border-b border-border/50 py-2 overflow-x-auto">
            <div className="container mx-auto px-4 flex items-center gap-1 whitespace-nowrap text-[11px] font-medium">
                {stats.map((stat, index) => (
                    <div key={stat.label} className="flex items-center">
                        {index > 0 && (
                            <div className="w-px h-3 bg-border/60 mx-3" />
                        )}
                        <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-default group">
                            <stat.icon className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <span className="opacity-80">{stat.subLabel || stat.label}:</span>
                            <span className="text-foreground font-semibold tabular-nums">{stat.value}</span>
                            {"change" in stat && stat.change !== undefined && (
                                <span className={`font-semibold tabular-nums ${stat.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {stat.change >= 0 ? "+" : ""}{stat.change.toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

