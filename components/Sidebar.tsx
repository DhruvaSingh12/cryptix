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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Home,
    BarChart3,
    Wallet,
    Star,
    Building2,
    LogOut,
    Settings,
    ChevronRight,
    ChevronLeft,
    PanelLeftClose,
    PanelLeft,
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
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export function Sidebar({ onNavigate, isCollapsed = false, onToggleCollapse }: SidebarProps) {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <div className={cn(
                "flex h-full flex-col border border-border rounded-lg transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[72px]" : "w-64"
            )}>
                {/* Logo */}
                <div className={cn(
                    "flex h-16 items-center transition-all duration-300",
                    isCollapsed ? "px-4 justify-center" : "px-6"
                )}>
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        {!isCollapsed && (
                            <span className="text-lg font-bold tracking-tight whitespace-nowrap">Monocera</span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={cn(
                    "flex-1 py-4 space-y-1 transition-all duration-300",
                    isCollapsed ? "px-2" : "px-3"
                )}>
                    {!isCollapsed && (
                        <p className="px-3 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                            Menu
                        </p>
                    )}
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const linkContent = (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                                    isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary-foreground")} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1">{item.name}</span>
                                        {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
                                    </>
                                )}
                            </Link>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip key={item.name}>
                                    <TooltipTrigger asChild>
                                        {linkContent}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-medium">
                                        {item.name}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return linkContent;
                    })}
                </nav>

                {/* Bottom Section */}
                <div className={cn(
                    "border-t border-border/50 space-y-2 transition-all duration-300",
                    isCollapsed ? "p-2" : "p-3"
                )}>
                    {/* Collapse Toggle */}
                    {onToggleCollapse && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size={isCollapsed ? "icon" : "sm"}
                                    onClick={onToggleCollapse}
                                    className={cn(
                                        "transition-all duration-200 text-muted-foreground hover:text-foreground",
                                        isCollapsed
                                            ? "w-full h-10 rounded-xl"
                                            : "w-full justify-start gap-2 px-3 h-9 rounded-xl"
                                    )}
                                >
                                    {isCollapsed ? (
                                        <PanelLeft className="h-4 w-4" />
                                    ) : (
                                        <>
                                            <PanelLeftClose className="h-4 w-4" />
                                            <span className="text-xs font-medium">Collapse</span>
                                        </>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="font-medium">
                                    Expand sidebar
                                </TooltipContent>
                            )}
                        </Tooltip>
                    )}

                    {/* Theme Toggle */}
                    {!isCollapsed && (
                        <div className="px-1">
                            <ThemeToggle />
                        </div>
                    )}

                    {/* User Menu */}
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full hover:bg-muted rounded-xl transition-all duration-200",
                                            isCollapsed
                                                ? "h-10 p-0 justify-center"
                                                : "justify-start gap-3 px-2 py-6"
                                        )}
                                    >
                                        <Avatar className={cn(
                                            "border border-border/50 shrink-0",
                                            isCollapsed ? "h-8 w-8" : "h-9 w-9"
                                        )}>
                                            <AvatarImage src={session?.user?.image || ""} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                                {session?.user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {!isCollapsed && (
                                            <div className="flex flex-col items-start text-sm flex-1 min-w-0">
                                                <span className="font-semibold truncate w-full text-left">
                                                    {session?.user?.name || "User"}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground truncate w-full text-left">
                                                    {session?.user?.email || "Sign in"}
                                                </span>
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="font-medium">
                                    {session?.user?.name || "User"}
                                </TooltipContent>
                            )}
                        </Tooltip>
                        <DropdownMenuContent align={isCollapsed ? "center" : "end"} side={isCollapsed ? "right" : "top"} className="w-56 rounded-xl">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{session?.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </TooltipProvider>
    );
}
