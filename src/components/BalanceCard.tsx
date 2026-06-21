"use client";

import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

interface BalanceCardProps {
    totalBalance: number;
    percentageChange: number;
    label?: string;
    isShielded?: boolean;
}

export default function BalanceCard({
    totalBalance,
    percentageChange,
    label = "Portfolio Balance",
    isShielded = true
}: BalanceCardProps) {
    return (
        <div className="main-card" style={{ 
            position: 'relative', 
            overflow: 'hidden',
            padding: '32px'
        }}>
            {/* Decorative Blob */}
            <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '160px',
                height: '160px',
                backgroundColor: 'rgba(183, 198, 194, 0.2)', // Sage blob
                borderRadius: '50%',
                filter: 'blur(40px)'
            }} />

            {/* Icon Holder */}
            <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: 'var(--shadow-subtle)',
                marginBottom: '24px',
                border: '1px solid var(--border)'
            }}>
                🏦
            </div>

            <span className="label-caps" style={{ color: 'var(--accent)', display: 'block', marginBottom: '8px' }}>
                {label}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: 900, margin: 0, color: 'var(--foreground)' }}>
                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>USD</span>
            </div>

            {/* Nested Metrics Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                marginBottom: '24px'
            }}>
                {/* Yield Metric */}
                <div className="glass-card" style={{ padding: '12px' }}>
                    <span className="label-caps" style={{ fontSize: '8px', color: 'var(--accent)' }}>Total Yield</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Zap size={14} color="var(--primary)" fill="var(--primary)" />
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>+12.4%</span>
                    </div>
                </div>

                {/* Shield Metric */}
                <div className="glass-card" style={{ padding: '12px' }}>
                    <span className="label-caps" style={{ fontSize: '8px', color: 'var(--accent)' }}>Shield Status</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <ShieldCheck size={14} color={isShielded ? "var(--primary)" : "var(--destructive)"} />
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>{isShielded ? "Active" : "Off"}</span>
                    </div>
                </div>
            </div>

            {/* Alert Box */}
            <div style={{
                backgroundColor: 'rgba(183, 198, 194, 0.15)',
                padding: '12px 16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.2
                }}>
                    <TrendingUp size={16} color="var(--primary-foreground)" />
                </div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', margin: 0 }}>
                    You saved <span style={{ color: 'var(--foreground)' }}>$124.50</span> in round-ups this month.
                </p>
            </div>
        </div>
    );
}
