"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Bell, Plus, TrendingUp, TrendingDown, X, AlertCircle } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import Image from "next/image";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { cn } from "@/lib/utils";

interface SearchResult {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
}

export function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Price alerts
    const {
        alerts,
        triggeredAlerts,
        addAlert,
        removeAlert,
        dismissTriggeredAlert,
        triggeredAlertsCount,
        activeAlertsCount,
    } = usePriceAlerts(session?.user?.id);

    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<SearchResult | null>(null);
    const [alertPrice, setAlertPrice] = useState("");
    const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const results = await coinGeckoAPI.search(query);
            setSearchResults(results.coins?.slice(0, 6) || []);
            setShowResults(true);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const navigateToCoin = (coinId: string) => {
        router.push(`/dashboard/explore/${coinId}`);
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setShowResults(false);
        }
    };

    const handleAddAlert = () => {
        if (!selectedCoin || !alertPrice) return;

        addAlert({
            coinId: selectedCoin.id,
            coinName: selectedCoin.name,
            coinSymbol: selectedCoin.symbol,
            coinImage: selectedCoin.thumb,
            targetPrice: parseFloat(alertPrice),
            condition: alertCondition,
        });

        setAlertDialogOpen(false);
        setSelectedCoin(null);
        setAlertPrice("");
        setAlertCondition("above");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        }).format(price);
    };

    return (
        <div className="h-16">
            <div className="flex h-full items-center justify-between px-6 gap-4">
                {/* Search */}
                <div
                    ref={containerRef}
                    className="relative flex-1 max-w-lg"
                    onBlur={handleBlur}
                >
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search coins, markets..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                        className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring/50 rounded-xl transition-all"
                    />

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-premium-lg z-50 overflow-hidden animate-fade-in">
                            {searchResults.map((coin) => (
                                <button
                                    key={coin.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        navigateToCoin(coin.id);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                                >
                                    <Image
                                        src={coin.thumb}
                                        alt={coin.name}
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{coin.name}</div>
                                        <div className="text-xs text-muted-foreground uppercase">
                                            {coin.symbol}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Add Alert Button */}
                    <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-primary" />
                                    Create Price Alert
                                </DialogTitle>
                                <DialogDescription>
                                    Get notified when a cryptocurrency reaches your target price
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Coin Search */}
                                <div className="space-y-2">
                                    <Label>Cryptocurrency</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Search for a coin..."
                                            value={selectedCoin ? selectedCoin.name : searchQuery}
                                            onChange={(e) => {
                                                setSelectedCoin(null);
                                                handleSearch(e.target.value);
                                            }}
                                            className="pr-10"
                                        />
                                        {selectedCoin && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                onClick={() => setSelectedCoin(null)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                    {!selectedCoin && searchResults.length > 0 && (
                                        <div className="border rounded-lg max-h-40 overflow-y-auto">
                                            {searchResults.map((coin) => (
                                                <button
                                                    key={coin.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCoin(coin);
                                                        setSearchQuery("");
                                                        setSearchResults([]);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2 hover:bg-accent text-left text-sm"
                                                >
                                                    <Image src={coin.thumb} alt={coin.name} width={20} height={20} className="rounded-full" />
                                                    <span className="font-medium">{coin.name}</span>
                                                    <span className="text-muted-foreground uppercase text-xs">{coin.symbol}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Condition */}
                                <div className="space-y-2">
                                    <Label>Alert when price is</Label>
                                    <Select value={alertCondition} onValueChange={(v: "above" | "below") => setAlertCondition(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="above">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                    Above target price
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="below">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                                    Below target price
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Target Price */}
                                <div className="space-y-2">
                                    <Label>Target Price (USD)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={alertPrice}
                                        onChange={(e) => setAlertPrice(e.target.value)}
                                        step="any"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddAlert} disabled={!selectedCoin || !alertPrice}>
                                    Create Alert
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted">
                                <Bell className="h-4 w-4" />
                                {triggeredAlertsCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center animate-pulse-subtle">
                                        {triggeredAlertsCount > 9 ? "9+" : triggeredAlertsCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 rounded-xl">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                <span>Price Alerts</span>
                                <span className="text-xs font-normal text-muted-foreground">
                                    {activeAlertsCount} active
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {triggeredAlerts.length === 0 && alerts.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Bell className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                                    <p className="text-sm text-muted-foreground">No price alerts</p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                        Create alerts to get notified
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto">
                                    {/* Triggered Alerts */}
                                    {triggeredAlerts.map((alert) => (
                                        <DropdownMenuItem
                                            key={alert.id}
                                            className="flex items-start gap-3 p-3 cursor-pointer"
                                            onClick={() => {
                                                router.push(`/dashboard/explore/${alert.coinId}`);
                                                dismissTriggeredAlert(alert.id);
                                            }}
                                        >
                                            <div className="relative">
                                                <Image
                                                    src={alert.coinImage}
                                                    alt={alert.coinName}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                                <div className={cn(
                                                    "absolute -bottom-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center",
                                                    alert.condition === "above" ? "bg-emerald-500" : "bg-red-500"
                                                )}>
                                                    {alert.condition === "above" ? (
                                                        <TrendingUp className="h-2.5 w-2.5 text-white" />
                                                    ) : (
                                                        <TrendingDown className="h-2.5 w-2.5 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">
                                                    {alert.coinName} hit {formatPrice(alert.targetPrice)}!
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Now at {formatPrice(alert.currentPrice)}
                                                </p>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}

                                    {triggeredAlerts.length > 0 && alerts.filter(a => !a.triggered).length > 0 && (
                                        <DropdownMenuSeparator />
                                    )}

                                    {/* Active Alerts */}
                                    {alerts.filter(a => !a.triggered).slice(0, 5).map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="flex items-center gap-3 p-3 text-sm group"
                                        >
                                            <Image
                                                src={alert.coinImage}
                                                alt={alert.coinName}
                                                width={28}
                                                height={28}
                                                className="rounded-full opacity-70"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-muted-foreground truncate">
                                                    {alert.coinSymbol.toUpperCase()} {alert.condition === "above" ? "↑" : "↓"} {formatPrice(alert.targetPrice)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAlert(alert.id);
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

