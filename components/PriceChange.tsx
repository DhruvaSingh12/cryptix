import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceChangeProps {
    value: number;
    showIcon?: boolean;
    className?: string;
}

export function PriceChange({ value, showIcon = true, className = "" }: PriceChangeProps) {
    const isPositive = value >= 0;

    return (
        <div
            className={cn(
                "flex items-center gap-0.5 font-medium tabular-nums",
                isPositive ? "text-emerald-500" : "text-red-500",
                className
            )}
        >
            {showIcon && (
                isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                )
            )}
            <span>{isPositive ? "+" : ""}{Math.abs(value).toFixed(2)}%</span>
        </div>
    );
}
