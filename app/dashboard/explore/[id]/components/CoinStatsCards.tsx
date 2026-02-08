import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinDetail } from "@/lib/api/types";

interface CoinStatsCardsProps {
    coin: CoinDetail;
    formatLargeNumber: (value: number) => string;
    formatPrice: (price: number) => string;
}

export function CoinStatsCards({ coin, formatLargeNumber, formatPrice }: CoinStatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Market Cap</CardDescription>
                    <CardTitle className="text-xl">
                        {formatLargeNumber(coin.market_data?.market_cap?.usd || 0)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>24h Volume</CardDescription>
                    <CardTitle className="text-xl">
                        {formatLargeNumber(coin.market_data?.total_volume?.usd || 0)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Circulating Supply</CardDescription>
                    <CardTitle className="text-xl">
                        {coin.market_data?.circulating_supply?.toLocaleString() || "N/A"}{" "}
                        <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>All-Time High</CardDescription>
                    <CardTitle className="text-xl">
                        {formatPrice(coin.market_data?.ath?.usd || 0)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-red-500">
                        {coin.market_data?.ath_change_percentage?.usd?.toFixed(1)}% from ATH
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
