"use client";

import {
    Coffee,
    ShoppingCart,
    Fuel,
    Tv,
    Shirt,
    Pill,
    Car,
    Smartphone,
    CreditCard,
    Utensils,
    Home,
    Plane,
    ArrowUpRight,
    ArrowDownLeft,
    type LucideIcon
} from "lucide-react";

// Icon mapping for transaction categories
const iconMap: Record<string, LucideIcon> = {
    coffee: Coffee,
    "shopping-cart": ShoppingCart,
    fuel: Fuel,
    tv: Tv,
    shirt: Shirt,
    pill: Pill,
    car: Car,
    smartphone: Smartphone,
    card: CreditCard,
    food: Utensils,
    home: Home,
    travel: Plane,
    send: ArrowUpRight,
    receive: ArrowDownLeft,
};

interface TransactionIconProps {
    icon: string;
    size?: number;
    className?: string;
}

export default function TransactionIcon({ icon, size = 20, className }: TransactionIconProps) {
    const IconComponent = iconMap[icon] || CreditCard;

    return (
        <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(204, 255, 0, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border)'
        }} className={className}>
            <IconComponent size={size} color="var(--primary)" strokeWidth={2.5} />
        </div>
    );
}
