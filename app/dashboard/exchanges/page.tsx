"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { Exchange } from "@/lib/api/types";
import { PageHeader } from "@/components/PageHeader";
import { ExchangeTable } from "./components/ExchangeTable";

export default function ExchangesPage() {
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchExchanges();
    }, [page]);

    const fetchExchanges = async () => {
        setLoading(true);
        try {
            const data = await coinGeckoAPI.getExchanges(50, page);
            setExchanges(data);
        } catch (error) {
            console.error("Error fetching exchanges:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Building2}
                iconColor="text-purple-500"
                title="Exchanges"
                description="Top cryptocurrency exchanges by volume"
            />

            <ExchangeTable exchanges={exchanges} loading={loading} />

            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
