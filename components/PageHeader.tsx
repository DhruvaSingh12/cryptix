import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    icon: LucideIcon;
    iconColor?: string;
    title: string;
    description: string;
    children?: React.ReactNode;
}

export function PageHeader({
    icon: Icon,
    iconColor = "text-primary",
    title,
    description,
    children,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Icon className={`h-8 w-8 ${iconColor}`} />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            {children && <div className="flex gap-2">{children}</div>}
        </div>
    );
}
