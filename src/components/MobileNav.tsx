"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Send, Zap, User, Inbox, Plus } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: CreditCard, label: "Home" },
    { href: "/payments", icon: Send, label: "Pay" },
    { href: "/swap", icon: Zap, label: "Swap" },
    { href: "/inbox", icon: Inbox, label: "Inbox" },
    { href: "/account", icon: User, label: "Profile" },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div style={{
            position: 'fixed',
            bottom: '8px',
            left: '8px',
            right: '8px',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '430px',
            margin: '0 auto',
        }}>
            <nav style={{
                width: '100%',
                height: '64px',
                background: 'var(--foreground)', // Obsidian
                borderRadius: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                position: 'relative'
            }}>
                {/* Left Icons */}
                <div style={{ display: 'flex', gap: '32px' }}>
                    {[navItems[0], navItems[1]].map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} style={{ color: isActive ? 'var(--primary)' : 'var(--accent)', opacity: isActive ? 1 : 0.6, transition: 'all 0.2s' }}>
                                <Icon size={24} />
                            </Link>
                        );
                    })}
                </div>

                {/* Center FAB with Cutout */}
                <div style={{
                    position: 'absolute',
                    top: '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}>
                    <Link href="/payments">
                        <button style={{
                            width: '56px',
                            height: '56px',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '50%',
                            border: '4px solid var(--background)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--foreground)',
                            boxShadow: '0 8px 24px rgba(204, 255, 0, 0.4)',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            padding: 0
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Plus size={28} strokeWidth={4} />
                        </button>
                    </Link>
                </div>

                {/* Right Icons */}
                <div style={{ display: 'flex', gap: '32px' }}>
                    {[navItems[3], navItems[4]].map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} style={{ color: isActive ? 'var(--primary)' : 'var(--accent)', opacity: isActive ? 1 : 0.6, transition: 'all 0.2s' }}>
                                <Icon size={24} />
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
