"use client";

import { Search, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import TransactionIcon from "@/components/TransactionIcon";
import { useWallet } from "@/lib/solana/wallet/context";

export default function HistoryPage() {
    const { status } = useWallet();
    const isConnected = status === "connected";
    
    // Mock data for history
    const history = isConnected ? [
        { id: "1", type: "send", amount: "12.50", currency: "SOL", timestamp: Date.now() - 3600000, status: "Confirmed", category: "send" },
        { id: "2", type: "receive", amount: "45.00", currency: "SOL", timestamp: Date.now() - 86400000, status: "Confirmed", category: "receive" },
        { id: "3", type: "send", amount: "2.40", currency: "SOL", timestamp: Date.now() - 172800000, status: "Confirmed", category: "food" },
        { id: "4", type: "send", amount: "88.00", currency: "SOL", timestamp: Date.now() - 259200000, status: "Confirmed", category: "travel" },
    ] : [];

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', minHeight: '100vh' }}>
                <div className="main-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <h2 className="subheading" style={{ marginBottom: '12px', margin: 0 }}>Vault Locked</h2>
                    <p style={{ color: 'var(--accent)', marginBottom: '30px', fontSize: '15px' }}>Connect your wallet to view your private payment history.</p>
                </div>
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="mobile-container" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{ 
                padding: '56px 20px 24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                background: 'var(--background)',
                zIndex: 10,
                borderBottom: '1px solid var(--border)'
            }}>
                <Link href="/dashboard" style={{ color: 'var(--foreground)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>History</h1>
                <div style={{ width: '24px' }}></div>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px' }}>
                    {/* Search & Filter */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <div style={{
                            flex: 1,
                            background: '#ffffff',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            border: '1px solid var(--border)'
                        }}>
                            <Search size={18} color="var(--accent)" />
                            <input 
                                type="text" 
                                placeholder="Search transactions..." 
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                    width: '100%',
                                    outline: 'none',
                                    fontWeight: 800
                                }}
                            />
                        </div>
                        <button style={{
                            width: '48px',
                            height: '48px',
                            background: '#ffffff',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border)',
                            cursor: 'pointer'
                        }}>
                            <Filter size={20} color="var(--primary)" />
                        </button>
                    </div>

                    {/* Transactions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {history.length === 0 ? (
                            <div className="main-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <p style={{ fontWeight: 800, fontSize: '18px', margin: 0 }}>No records found</p>
                                <p style={{ fontSize: '14px', color: 'var(--accent)', marginTop: '8px', margin: 0 }}>Your Solana transaction history will appear here.</p>
                            </div>
                        ) : (
                            history.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="main-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <TransactionIcon icon={tx.category} />
                                        <div>
                                            <p style={{ fontWeight: 800, color: 'var(--foreground)', fontSize: '15px', margin: 0 }}>
                                                {tx.type === "send" ? "Sent" : "Received"}
                                            </p>
                                            <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>
                                                {new Date(tx.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: 800, color: tx.type === "send" ? "var(--foreground)" : "var(--primary)", margin: 0 }}>
                                            {tx.type === "send" ? "-" : "+"}{tx.amount} SOL
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>{tx.status}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
