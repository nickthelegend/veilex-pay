"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Bell, Shield, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { useWallet } from "@/lib/solana/wallet/context";

export default function AccountPage() {
    const { wallet, status, disconnect } = useWallet();
    const isConnected = status === "connected";
    const address = wallet?.account.address;
    
    // Mock profile data
    const profile = { 
        displayName: address ? `User ${address.slice(0, 4)}` : "Guest",
        isRegistered: true,
        spendingPubKey: address || ""
    };

    const menuItems = [
        { icon: <CreditCard size={20} />, label: "My Cards", href: "/dashboard", badge: null },
        { icon: <Bell size={20} />, label: "Notifications", href: "#", badge: "3" },
        { icon: <Shield size={20} />, label: "Security", href: "#", badge: null },
        { icon: <Settings size={20} />, label: "Settings", href: "#", badge: null },
        { icon: <HelpCircle size={20} />, label: "Help", href: "#", badge: null },
    ];

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="main-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <h2 className="subheading" style={{ marginBottom: '12px' }}>Account Locked</h2>
                    <p style={{ color: 'var(--accent)', marginBottom: '30px' }}>Connect your wallet to manage your private investment account.</p>
                </div>
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="mobile-container" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{ padding: '56px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                <Link href="/dashboard" style={{ color: 'var(--foreground)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Account</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px' }}>
                    {/* Profile Card */}
                    <div className="main-card" style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(204, 255, 0, 0.1)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                border: '1px solid var(--border)'
                            }}>
                                {address?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{profile.displayName}</h2>
                                <p style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'monospace', margin: 0 }}>{address?.slice(0, 8)}...{address?.slice(-8)}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px' }}>Status</p>
                                <p style={{ fontWeight: 800, fontSize: '14px', margin: 0 }}>Verified</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px' }}>Network</p>
                                <p style={{ fontWeight: 800, fontSize: '14px', margin: 0 }}>Solana</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px' }}>Privacy</p>
                                <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '14px', margin: 0 }}>Stealth</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '24px',
                        marginTop: '24px',
                        border: '1px solid var(--border)'
                    }}>
                        {menuItems.map((item, i) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '20px',
                                    textDecoration: 'none',
                                    borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(204, 255, 0, 0.1)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{item.label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {item.badge && (
                                        <span style={{
                                            padding: '4px 8px',
                                            background: 'var(--primary)',
                                            color: 'var(--primary-foreground)',
                                            fontSize: '10px',
                                            fontWeight: 800,
                                            borderRadius: '10px'
                                        }}>
                                            {item.badge}
                                        </span>
                                    )}
                                    <ChevronRight size={20} color="var(--accent)" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Disconnect */}
                    <button 
                        onClick={() => disconnect()}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '20px',
                            background: 'rgba(220, 38, 38, 0.05)',
                            color: '#ef4444',
                            border: '1px solid rgba(220, 38, 38, 0.1)',
                            borderRadius: '24px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={20} />
                        Disconnect Wallet
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent)', marginTop: '32px' }}>
                        VeilPay v1.0.0 • Connected via Solana
                    </p>
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
