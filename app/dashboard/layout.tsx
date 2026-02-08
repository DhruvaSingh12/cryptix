"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:hidden">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <VisuallyHidden>
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </VisuallyHidden>
                        <Sidebar onNavigate={() => setSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
                <h1 className="text-xl font-bold">Monocera</h1>
            </header>

            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-background md:block">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="md:pl-64">
                {/* Desktop Navbar */}
                <div className="hidden md:block sticky top-0 z-30">
                    <Navbar />
                </div>

                {/* Page Content */}
                <main>
                    <div className="container mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
