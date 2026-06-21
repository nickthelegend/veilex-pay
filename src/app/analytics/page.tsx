"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { useWallet } from "@/lib/solana/wallet/context";

export default function AnalyticsPage() {
    const { status } = useWallet();
    const isConnected = status === "connected";

    // Mock data for analytics
    const liveInvestments = [
        { id: 1, name: "Solana (SOL)", symbol: "SOL", type: "crypto", currentValue: 12.5, percentageChange: 8.24 },
        { id: 2, name: "Stealth Savings", symbol: "SSP", type: "stock", currentValue: 1.2, percentageChange: 12.5 },
    ];

    const totalValue = useMemo(() => {
        return liveInvestments.reduce((acc, inv) => acc + inv.currentValue, 0);
    }, [liveInvestments]);

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="main-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <h2 className="subheading" style={{ marginBottom: '12px' }}>Analytics Locked</h2>
                    <p style={{ color: 'var(--accent)', marginBottom: '30px' }}>Connect your wallet to view your portfolio analytics.</p>
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
                <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Analytics</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px' }}>
                    {/* Main Chart Placeholder */}
                    <div className="main-card" style={{ marginTop: '20px', marginBottom: '24px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <p style={{ color: 'var(--accent)', fontWeight: 600 }}>Chart loading...</p>
                    </div>

                    {/* Investment Portfolio */}
                    <div className="main-card">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px', margin: 0 }}>Total Portfolio Value</p>
                                <span style={{
                                    fontSize: '28px',
                                    fontWeight: 800,
                                    color: 'var(--foreground)',
                                    fontVariantNumeric: 'tabular-nums'
                                }}>
                                    {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SOL
                                </span>
                            </div>
                        </div>

                        <h3 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '16px', fontSize: '14px', margin: 0 }}>Holdings</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {liveInvestments.map((inv) => (
                                <div
                                    key={inv.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: 'rgba(0,0,0,0.02)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            fontWeight: 800,
                                            background: inv.type === 'stock' ? 'rgba(204, 255, 0, 0.1)' : 'var(--primary)',
                                            color: 'var(--primary-foreground)'
                                        }}>
                                            {inv.type === 'stock' ? '💰' : '🛰️'}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{inv.name}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>{inv.symbol}</p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
                                            {inv.currentValue.toFixed(2)} SOL
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, margin: 0 }}>
                                            +{inv.percentageChange}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Activity Feed Snippet */}
                    <div style={{ marginTop: '24px' }}>
                         <Link href="/history" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%',
                                padding: '20px',
                                background: '#ffffff',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                color: 'var(--primary)',
                                fontWeight: 800,
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}>
                                View Detailed History
                            </button>
                         </Link>
                    </div>
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
