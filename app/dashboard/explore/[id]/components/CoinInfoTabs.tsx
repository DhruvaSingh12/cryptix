import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Github, Twitter } from "lucide-react";
import { CoinDetail } from "@/lib/api/types";

interface CoinInfoTabsProps {
    coin: CoinDetail;
    formatPrice: (price: number) => string;
}

export function CoinInfoTabs({ coin, formatPrice }: CoinInfoTabsProps) {
    return (
        <Tabs defaultValue="about" className="w-full">
            <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>About {coin.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="prose prose-invert max-w-none text-sm text-muted-foreground"
                            dangerouslySetInnerHTML={{
                                __html: coin.description?.en || "No description available.",
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                                <StatRow label="24h Low" value={formatPrice(coin.market_data?.low_24h?.usd || 0)} />
                                <StatRow label="24h High" value={formatPrice(coin.market_data?.high_24h?.usd || 0)} />
                                <StatRow
                                    label="7d Change"
                                    value={`${coin.market_data?.price_change_percentage_7d?.toFixed(2)}%`}
                                    isChange
                                    changeValue={coin.market_data?.price_change_percentage_7d || 0}
                                />
                                <StatRow
                                    label="30d Change"
                                    value={`${coin.market_data?.price_change_percentage_30d?.toFixed(2)}%`}
                                    isChange
                                    changeValue={coin.market_data?.price_change_percentage_30d || 0}
                                />
                            </div>
                            <div className="space-y-3">
                                <StatRow label="Max Supply" value={coin.market_data?.max_supply?.toLocaleString() || "∞"} />
                                <StatRow label="Total Supply" value={coin.market_data?.total_supply?.toLocaleString() || "N/A"} />
                                <StatRow label="All-Time Low" value={formatPrice(coin.market_data?.atl?.usd || 0)} />
                                <StatRow
                                    label="From ATL"
                                    value={`+${coin.market_data?.atl_change_percentage?.usd?.toFixed(0)}%`}
                                    isChange
                                    changeValue={coin.market_data?.atl_change_percentage?.usd || 0}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="links" className="mt-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-3">
                            {coin.links?.homepage?.[0] && (
                                <LinkButton href={coin.links.homepage[0]} icon={<Globe className="h-4 w-4 mr-2" />}>
                                    Website
                                </LinkButton>
                            )}
                            {coin.links?.repos_url?.github?.[0] && (
                                <LinkButton href={coin.links.repos_url.github[0]} icon={<Github className="h-4 w-4 mr-2" />}>
                                    GitHub
                                </LinkButton>
                            )}
                            {coin.links?.twitter_screen_name && (
                                <LinkButton href={`https://twitter.com/${coin.links.twitter_screen_name}`} icon={<Twitter className="h-4 w-4 mr-2" />}>
                                    Twitter
                                </LinkButton>
                            )}
                            {coin.links?.subreddit_url && (
                                <LinkButton href={coin.links.subreddit_url}>
                                    Reddit
                                </LinkButton>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function StatRow({
    label,
    value,
    isChange = false,
    changeValue = 0,
}: {
    label: string;
    value: string;
    isChange?: boolean;
    changeValue?: number;
}) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className={isChange ? (changeValue >= 0 ? "text-green-500" : "text-red-500") : ""}>
                {value}
            </span>
        </div>
    );
}

function LinkButton({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
                {icon}
                {children}
                <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
        </a>
    );
}
