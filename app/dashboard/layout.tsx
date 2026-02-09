"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "cryptix-sidebar-collapsed";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load collapsed state from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
        if (stored !== null) {
            setIsCollapsed(stored === "true");
        }
        setMounted(true);
    }, []);

    // Save collapsed state to localStorage
    const handleToggleCollapse = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="h-screen bg-background p-2 flex gap-2">
                <div className="hidden md:block w-64 bg-card rounded-xl" />
                <div className="flex-1 bg-card rounded-xl overflow-hidden">
                    <main className="h-full overflow-auto">
                        <div className="container mx-auto">{children}</div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background p-2 flex gap-2 overflow-hidden">
            {/* Mobile Header - Only visible on mobile */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:hidden">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-card">
                        <VisuallyHidden>
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </VisuallyHidden>
                        <Sidebar onNavigate={() => setSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
                <h1 className="text-lg font-bold">Monocera</h1>
            </header>

            {/* Desktop Sidebar Card */}
            <aside
                className={cn(
                    "hidden md:flex h-full overflow-hidden transition-all duration-300 ease-in-out shrink-0",
                    isCollapsed ? "w-[72px]" : "w-64"
                )}
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />
            </aside>

            {/* Main Content Card */}
            <div className="flex-1 flex flex-col gap-2 overflow-hidden min-w-0">
                {/* Desktop Navbar */}
                <div className="hidden md:block shrink-0 border border-border rounded-lg">
                    <Navbar />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-auto pt-14 md:pt-0 border border-border rounded-lg">
                    <div className="container mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}