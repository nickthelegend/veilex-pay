"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { Loader2, Coins, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";
import { useDusdc } from "@/hooks/useDusdc";

export default function FaucetPage() {
    const { wallet } = useWallet();
    const address = wallet?.account.address;
    const { balance: hskBalance } = useBalance(address);
    const { balance: dusdcBalance, faucet, configured } = useDusdc();
    const [isMinting, setIsMinting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleMint = async () => {
        if (!address) return;
        setIsMinting(true);
        setIsSuccess(false);
        try {
            await faucet();
            setIsSuccess(true);
        } catch {
            /* toast handled in useDusdc */
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <main className="mobile-container">
            <Header title="Faucet" />

            <PageTransition>
                <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Hero */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(204, 255, 0, 0.1)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Coins size={40} color="var(--primary)" />
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '12px', margin: 0 }}>
                            dUSDC Faucet
                        </h1>
                        <p style={{ color: 'var(--accent)', fontSize: '15px', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
                            Mint 1,000 dUSDC (Demo USD Coin) to test private payments and dark-pool swaps on VeilPay.
                        </p>
                    </div>

                    {/* Balances */}
                    <div className="main-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={20} color="var(--accent)" />
                                </div>
                                <div>
                                    <p className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>dUSDC Balance</p>
                                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
                                        {dusdcBalance.toFixed(2)}
                                        <span style={{ fontSize: '14px', color: 'var(--accent)', marginLeft: '6px' }}>dUSDC</span>
                                    </p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Gas</p>
                                <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>
                                    {hskBalance ? hskBalance.toFixed(3) : "0.000"} HSK
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button
                            onClick={handleMint}
                            disabled={isMinting || !address || !configured}
                            style={{ width: '100%', padding: '18px', borderRadius: '20px', background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', fontWeight: 800, fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', opacity: (isMinting || !address || !configured) ? 0.6 : 1 }}
                        >
                            {isMinting ? (<><Loader2 size={24} className="animate-spin" /><span>Minting…</span></>)
                                       : (<><span>Mint 1,000 dUSDC</span><ArrowRight size={20} /></>)}
                        </button>

                        {!configured && (
                            <p style={{ fontSize: '12px', color: 'var(--accent)', textAlign: 'center', margin: 0 }}>
                                dUSDC address not set — deploy dUSDC and set NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS.
                            </p>
                        )}

                        {isSuccess && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(74, 222, 128, 0.1)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                <CheckCircle2 size={20} color="#4ade80" />
                                <p style={{ fontSize: '14px', color: '#4ade80', fontWeight: 800, margin: 0 }}>1,000 dUSDC minted to your wallet!</p>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px', background: 'rgba(204, 255, 0, 0.05)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '13px', color: 'var(--accent)', lineHeight: 1.6, margin: 0 }}>
                            dUSDC is a testnet token on HashKey Chain with no monetary value. The faucet dispenses 1,000 dUSDC per hour per address. You&apos;ll need a little HSK for gas.
                        </p>
                    </div>
                </div>
            </PageTransition>

            <MobileNav />
        </main>
    );
}
