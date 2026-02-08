import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceChangeProps {
    value: number;
    showIcon?: boolean;
    className?: string;
}

export function PriceChange({ value, showIcon = true, className = "" }: PriceChangeProps) {
    const isPositive = value >= 0;
    const colorClass = isPositive ? "text-green-500" : "text-red-500";

    return (
        <div className={`flex items-center gap-1 ${colorClass} ${className}`}>
            {showIcon && (
                isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                ) : (
                    <TrendingDown className="h-4 w-4" />
                )
            )}
            {Math.abs(value).toFixed(2)}%
        </div>
    );
}
