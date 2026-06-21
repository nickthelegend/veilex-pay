"use client";

import { useWallet } from "@/lib/solana/wallet/context";
import { WalletButton } from "@/components/solana/wallet-button";

interface HeaderProps {
    userName?: string;
}

export default function Header({ userName }: HeaderProps) {
    const { wallet, status } = useWallet();
    const isConnected = status === "connected";
    const address = wallet?.account.address;

    const displayName = userName || (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Guest");

    return (
        <header style={{
            padding: '56px 20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '430px',
            margin: '0 auto',
            background: 'transparent',
        }}>
            {/* Left side: Greeting */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="label-caps" style={{ color: 'var(--accent)' }}>
                    {isConnected ? "Welcome back" : "Good Morning"}
                </span>
                <h1 style={{ 
                    fontSize: '30px', 
                    fontWeight: 800, 
                    color: 'var(--foreground)',
                    margin: 0,
                    lineHeight: 1
                }}>
                    {displayName}
                </h1>
            </div>

            {/* Right side: Wallet Connection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <WalletButton />
            </div>
        </header>
    );
}

