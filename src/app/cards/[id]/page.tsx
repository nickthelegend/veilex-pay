"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoreVertical, CreditCard as CardIcon, Lock, RefreshCw, Trash2, Eye, EyeOff, ChevronRight } from "lucide-react";
import { useState } from "react";
import MobileNav from "@/components/MobileNav";
import VirtualCard from "@/components/VirtualCard";
import TransactionIcon from "@/components/TransactionIcon";
import PageTransition from "@/components/PageTransition";
import { useWallet } from "@/lib/solana/wallet/context";

export default function CardDetailPage() {
    const { status } = useWallet();
    const isConnected = status === "connected";
    const [showBalance, setShowBalance] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    // Mock data for payment history
    const history = isConnected ? [
        { id: "1", direction: "sent", amount: "5.00", currency: "SOL", timestamp: Date.now() - 86400000, status: "confirmed" },
        { id: "2", direction: "receive", amount: "10.00", currency: "SOL", timestamp: Date.now() - 172800000, status: "confirmed" },
    ] : [];

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '12px', margin: 0 }}>Card not found</p>
                    <Link href="/dashboard" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const totalSpent = history.filter(tx => tx.direction === "sent").reduce((acc, tx) => acc + parseFloat(tx.amount), 0);
    const totalReceived = history.filter(tx => tx.direction === "receive").reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

    const menuItems = [
        { icon: <Lock size={20} />, label: "Lock Card", color: 'var(--foreground)' },
        { icon: <RefreshCw size={20} />, label: "Change Limit", color: 'var(--foreground)' },
        { icon: <CardIcon size={20} />, label: "Card Details", color: 'var(--foreground)' },
        { icon: <Trash2 size={20} />, label: "Delete Card", color: '#ef4444' },
    ];

    return (
        <div className="mobile-container" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                borderBottom: '1px solid var(--border)'
            }}>
                <Link href="/dashboard" style={{
                    padding: '8px',
                    textDecoration: 'none',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ArrowLeft size={24} color="var(--primary)" />
                </Link>
                <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Card Details</h1>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    style={{
                        padding: '8px',
                        background: 'rgba(0,0,0,0.05)',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer'
                    }}
                >
                    <MoreVertical size={24} color="var(--foreground)" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="main-card" style={{
                        position: 'absolute',
                        top: '64px',
                        right: '20px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        zIndex: 100,
                        minWidth: '220px',
                        padding: 0
                    }}>
                        {menuItems.map((item, i) => (
                            <button
                                key={item.label}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px 20px',
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                                    cursor: 'pointer',
                                    color: item.color,
                                    fontSize: '15px',
                                    fontWeight: 800,
                                    textAlign: 'left'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px', maxWidth: '430px', margin: '0 auto' }}>
                    {/* Live Virtual Card */}
                    <div style={{ marginBottom: '24px', marginTop: '20px' }}>
                        <VirtualCard />
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '24px'
                    }}>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="main-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {showBalance ? <EyeOff size={24} color="var(--primary)" /> : <Eye size={24} color="var(--primary)" />}
                            <span className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>
                                {showBalance ? 'Hide' : 'Show'}
                            </span>
                        </button>

                        <button className="main-card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            <Lock size={24} color="var(--primary)" />
                            <span className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Lock</span>
                        </button>

                        <button className="main-card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            <RefreshCw size={24} color="var(--primary)" />
                            <span className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Limit</span>
                        </button>
                    </div>

                    {/* Card Stats */}
                    <div className="main-card" style={{
                        padding: '24px',
                        marginBottom: '24px',
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '20px', margin: 0 }}>Summary</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="main-card" style={{ padding: '16px' }}>
                                <p className="label-caps" style={{ color: 'var(--accent)', marginBottom: '4px', margin: 0 }}>Total Payouts</p>
                                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
                                    {showBalance ? `${totalSpent.toFixed(2)} SOL` : "****"}
                                </p>
                            </div>
                            <div className="main-card" style={{ padding: '16px' }}>
                                <p className="label-caps" style={{ color: 'var(--primary)', marginBottom: '4px', margin: 0 }}>Total Yield</p>
                                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                                    {showBalance ? `${totalReceived.toFixed(2)} SOL` : "****"}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: 'var(--accent)' }}>Account Usage</span>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--foreground)' }}>{history.length} stealth events</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: history.length ? `${Math.min(history.length * 5, 100)}%` : '0%',
                                    height: '100%',
                                    background: 'var(--primary)',
                                    borderRadius: '4px',
                                    transition: 'width 0.5s ease',
                                }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Card Transactions */}
                    <div className="main-card" style={{
                        padding: '24px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Recent Activity</h3>
                            <Link href="/history" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '14px',
                                color: 'var(--primary)',
                                fontWeight: 800,
                                textDecoration: 'none'
                            }}>
                                See All
                                <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {history.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="main-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <TransactionIcon icon={tx.direction === "sent" ? "send" : "receive"} />
                                        <div>
                                            <p style={{ fontWeight: 800, color: 'var(--foreground)', fontSize: '15px', margin: 0 }}>
                                                {tx.direction === "sent" ? "Sent" : "Received"}
                                            </p>
                                            <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>
                                                {new Date(tx.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 800, color: tx.direction === "sent" ? "var(--foreground)" : "var(--primary)", margin: 0 }}>
                                            {tx.direction === "sent" ? "-" : "+"}{tx.amount}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>{tx.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </PageTransition>

            <MobileNav />

            {/* Overlay for menu */}
            {showMenu && (
                <div
                    onClick={() => setShowMenu(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 50
                    }}
                />
            )}
        </div>
    );
}
