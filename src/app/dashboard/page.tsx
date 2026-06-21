"use client";

import { Plus, Check } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import BalanceCard from "@/components/BalanceCard";
import PageTransition from "@/components/PageTransition";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";
import { lamportsToSolString } from "@/lib/solana/lamports";
import { useState } from "react";

export default function DashboardPage() {
    const { wallet, status } = useWallet();
    const isConnected = status === "connected";
    const address = wallet?.account.address;
    
    const [activeCategory, setActiveCategory] = useState("All");
    
    // Solana balance hook
    const { lamports } = useBalance(address);

    const totalBalance = lamports !== null ? parseFloat(lamportsToSolString(lamports)) : 12450.50; // Mock if not connected for demo
    
    const categories = ["All", "Investing", "Payments", "Savings", "Rewards"];

    // Mock data for history and profile since Convex is removed
    const history: any[] = []; 
    const profile = { isRegistered: true, spendingPubKey: address || "" };

    return (
        <div className="mobile-container" style={{ paddingBottom: '120px' }}>
            <Header />

            <PageTransition>
                <main style={{ padding: '0 20px' }}>
                    
                    {/* Horizontal Scroll Selector */}
                    <div className="hide-scrollbar" style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        overflowX: 'auto', 
                        padding: '8px 0 24px',
                        scrollSnapType: 'x mandatory'
                    }}>
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        minWidth: isActive ? '160px' : '56px',
                                        height: '56px',
                                        backgroundColor: isActive ? 'var(--foreground)' : '#ffffff',
                                        borderRadius: isActive ? '28px' : '16px',
                                        border: isActive ? 'none' : '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: isActive ? 'space-between' : 'center',
                                        padding: isActive ? '0 8px 0 20px' : '0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        scrollSnapAlign: 'start',
                                        flexShrink: 0
                                    }}
                                >
                                    {isActive ? (
                                        <>
                                            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>{cat}</span>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: 'var(--primary)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--primary-foreground)',
                                                fontWeight: 800,
                                                fontSize: '12px'
                                            }}>
                                                {history?.length || 0}
                                            </div>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: '20px' }}>
                                            {cat === "All" ? "🏠" : cat === "Investing" ? "📈" : cat === "Payments" ? "💸" : cat === "Savings" ? "🐷" : "🎁"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Hero Balance Card */}
                    <BalanceCard
                        totalBalance={totalBalance}
                        percentageChange={2.8}
                        isShielded={profile?.isRegistered}
                    />

                    {/* Recent Activity (Secondary Feed Items) */}
                    <div style={{ marginTop: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 className="subheading" style={{ margin: 0 }}>Recent Activity</h2>
                            <span className="label-caps" style={{ color: 'var(--accent)' }}>View All</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(!history || history.length === 0) ? (
                                // Mock data for empty state
                                [1, 2, 3].map((i) => (
                                    <ActivityItem 
                                        key={i}
                                        title={i === 1 ? "Starbucks Coffee" : i === 2 ? "Netflix Subscription" : "Apple Store"}
                                        amount={i === 1 ? -4.50 : i === 2 ? -15.99 : -129.00}
                                        category={i === 1 ? "Food" : i === 2 ? "Entertainment" : "Tech"}
                                        date="Today, 10:45 AM"
                                    />
                                ))
                            ) : (
                                history.slice(0, 5).map((tx: any) => (
                                    <ActivityItem 
                                        key={tx._id}
                                        title={tx.direction === "sent" ? "Sent Payment" : "Received Payment"}
                                        amount={tx.direction === "sent" ? -parseFloat(tx.amountFormatted) : parseFloat(tx.amountFormatted)}
                                        category="Transaction"
                                        date={new Date(tx.sentAt || tx.discoveredAt).toLocaleDateString()}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stealth Identity (Bento Metric Style) */}
                    <div style={{ marginTop: '32px', marginBottom: '24px' }}>
                        <h2 className="subheading" style={{ marginBottom: '16px' }}>Stealth Identity</h2>
                        <div className="nested-card" style={{ 
                            background: 'var(--foreground)', 
                            color: '#ffffff',
                            padding: '24px'
                        }}>
                             <span className="label-caps" style={{ color: 'var(--accent)', opacity: 0.7 }}>Meta-Address Status</span>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                <div style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    borderRadius: '50%', 
                                    backgroundColor: profile?.isRegistered ? 'var(--primary)' : 'var(--destructive)',
                                    boxShadow: `0 0 10px ${profile?.isRegistered ? 'var(--primary)' : 'var(--destructive)'}`
                                }} />
                                <span style={{ fontWeight: 800, fontSize: '18px' }}>
                                    {profile?.isRegistered ? "Shielded & Verified" : "Identity Unlinked"}
                                </span>
                             </div>
                             <p style={{ 
                                marginTop: '16px', 
                                fontSize: '12px', 
                                color: 'var(--accent)', 
                                opacity: 0.6,
                                fontFamily: 'monospace',
                                wordBreak: 'break-all'
                            }}>
                                {profile?.spendingPubKey ? `${profile.spendingPubKey.slice(0, 32)}...` : "Connect wallet to view status"}
                             </p>
                        </div>
                    </div>
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}

function ActivityItem({ title, amount, category, date }: { title: string, amount: number, category: string, date: string }) {
    const isNegative = amount < 0;
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '16px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(204, 255, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    {category === "Food" ? "☕️" : category === "Entertainment" ? "📺" : "💳"}
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>{date}</p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: isNegative ? 'var(--foreground)' : 'var(--primary)' }}>
                        {isNegative ? '-' : '+'}${Math.abs(amount).toFixed(2)}
                    </p>
                </div>
                <button className="checkbox-button" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: 'transparent'
                }}>
                    <Check size={18} color="var(--accent)" />
                </button>
            </div>
            
            <style jsx>{`
                .checkbox-button:hover {
                    background-color: var(--primary) !important;
                    border-color: var(--primary) !important;
                }
                .checkbox-button:hover :global(svg) {
                    color: var(--primary-foreground) !important;
                }
            `}</style>
        </div>
    );
}
