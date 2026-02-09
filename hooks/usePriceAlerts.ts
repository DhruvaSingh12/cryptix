"use client";

import { useState, useEffect, useCallback } from "react";
import coinGeckoAPI from "@/lib/api/coingecko";

export interface PriceAlert {
    id: string;
    coinId: string;
    coinName: string;
    coinSymbol: string;
    coinImage: string;
    targetPrice: number;
    condition: "above" | "below";
    currentPrice: number;
    triggered: boolean;
    triggeredAt?: Date;
    createdAt: Date;
}

const STORAGE_KEY = "cryptix-price-alerts";

export function usePriceAlerts(userId?: string) {
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);
    const [loading, setLoading] = useState(true);

    const storageKey = `${STORAGE_KEY}-${userId || "guest"}`;

    // Load alerts from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setAlerts(parsed.map((a: any) => ({
                    ...a,
                    createdAt: new Date(a.createdAt),
                    triggeredAt: a.triggeredAt ? new Date(a.triggeredAt) : undefined,
                })));
            } catch (e) {
                console.error("Failed to parse alerts:", e);
            }
        }
        setLoading(false);
    }, [storageKey]);

    // Save alerts to localStorage
    const saveAlerts = useCallback((newAlerts: PriceAlert[]) => {
        localStorage.setItem(storageKey, JSON.stringify(newAlerts));
        setAlerts(newAlerts);
    }, [storageKey]);

    // Check prices and trigger alerts
    const checkAlerts = useCallback(async () => {
        const activeAlerts = alerts.filter(a => !a.triggered);
        if (activeAlerts.length === 0) return;

        const coinIds = [...new Set(activeAlerts.map(a => a.coinId))];
        
        try {
            const prices = await coinGeckoAPI.getSimplePrice(coinIds, ["usd"]);
            const newTriggered: PriceAlert[] = [];
            
            const updatedAlerts = alerts.map(alert => {
                if (alert.triggered) return alert;
                
                const currentPrice = prices[alert.coinId]?.usd;
                if (!currentPrice) return { ...alert, currentPrice: alert.currentPrice };
                
                const shouldTrigger = 
                    (alert.condition === "above" && currentPrice >= alert.targetPrice) ||
                    (alert.condition === "below" && currentPrice <= alert.targetPrice);
                
                if (shouldTrigger) {
                    const triggeredAlert = {
                        ...alert,
                        currentPrice,
                        triggered: true,
                        triggeredAt: new Date(),
                    };
                    newTriggered.push(triggeredAlert);
                    return triggeredAlert;
                }
                
                return { ...alert, currentPrice };
            });

            if (newTriggered.length > 0) {
                setTriggeredAlerts(prev => [...newTriggered, ...prev].slice(0, 10));
            }
            
            saveAlerts(updatedAlerts);
        } catch (error) {
            console.error("Failed to check alerts:", error);
        }
    }, [alerts, saveAlerts]);

    // Periodic price checking
    useEffect(() => {
        if (alerts.some(a => !a.triggered)) {
            checkAlerts();
            const interval = setInterval(checkAlerts, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [alerts, checkAlerts]);

    // Add new alert
    const addAlert = useCallback((alert: Omit<PriceAlert, "id" | "triggered" | "triggeredAt" | "createdAt" | "currentPrice">) => {
        const newAlert: PriceAlert = {
            ...alert,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            triggered: false,
            currentPrice: 0,
            createdAt: new Date(),
        };
        saveAlerts([...alerts, newAlert]);
        return newAlert;
    }, [alerts, saveAlerts]);

    // Remove alert
    const removeAlert = useCallback((alertId: string) => {
        saveAlerts(alerts.filter(a => a.id !== alertId));
    }, [alerts, saveAlerts]);

    // Clear triggered alerts
    const clearTriggeredAlerts = useCallback(() => {
        setTriggeredAlerts([]);
    }, []);

    // Dismiss a single triggered alert notification
    const dismissTriggeredAlert = useCallback((alertId: string) => {
        setTriggeredAlerts(prev => prev.filter(a => a.id !== alertId));
    }, []);

    // Get active (non-triggered) alerts count
    const activeAlertsCount = alerts.filter(a => !a.triggered).length;
    const triggeredAlertsCount = triggeredAlerts.length;

    return {
        alerts,
        triggeredAlerts,
        loading,
        addAlert,
        removeAlert,
        clearTriggeredAlerts,
        dismissTriggeredAlert,
        activeAlertsCount,
        triggeredAlertsCount,
        checkAlerts,
    };
}
