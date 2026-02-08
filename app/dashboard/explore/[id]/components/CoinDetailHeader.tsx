import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { CoinDetail } from "@/lib/api/types";
import Link from "next/link";
import Image from "next/image";

interface CoinDetailHeaderProps {
    coin: CoinDetail;
    formatPrice: (price: number) => string;
}

export function CoinDetailHeader({ coin, formatPrice }: CoinDetailHeaderProps) {
    const priceChange24h = coin.market_data?.price_change_percentage_24h || 0;
    const isPositive = priceChange24h >= 0;

    return (
        <div className="flex items-center gap-4">
            <Link href="/dashboard/explore">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <Image
                src={coin.image?.large || ""}
                alt={coin.name}
                width={48}
                height={48}
                className="rounded-full"
            />
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground">{coin.name}</h1>
                    <Badge variant="secondary" className="uppercase">
                        {coin.symbol}
                    </Badge>
                    {coin.market_cap_rank && (
                        <Badge variant="outline">Rank #{coin.market_cap_rank}</Badge>
                    )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                    <span className="text-2xl font-bold">
                        {formatPrice(coin.market_data?.current_price?.usd || 0)}
                    </span>
                    <span
                        className={`flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
                    >
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(priceChange24h).toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
