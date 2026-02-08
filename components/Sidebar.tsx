"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Home,
    TrendingUp,
    Search,
    BarChart3,
    Wallet,
    Star,
    Building2,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggler";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Compare", href: "/dashboard/compare", icon: BarChart3 },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: Star },
    { name: "Exchanges", href: "/dashboard/exchanges", icon: Building2 },
];

interface SidebarProps {
    onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-border px-6">
                <h1 className="text-2xl font-bold">Monocera</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Theme Toggle */}
            <div className="px-4 py-2">
                <ThemeToggle />
            </div>

            {/* User Menu */}
            <div className="border-t border-border p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 px-2"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback>
                                    {session?.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-sm">
                                <span className="font-medium">
                                    {session?.user?.name || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {session?.user?.email}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-red-600"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
