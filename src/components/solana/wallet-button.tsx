"use client";

// EVM wallet button (HashKey Chain) powered by RainbowKit, styled to match the
// VeilPay aesthetic. Kept at this path/name so existing imports keep working.
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        const baseBtn: React.CSSProperties = {
          cursor: "pointer",
          borderRadius: "12px",
          backgroundColor: "var(--primary)",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: 800,
          color: "var(--foreground)",
          border: "none",
          boxShadow: "0 4px 12px rgba(204, 255, 0, 0.2)",
        };

        return (
          <div {...(!ready && { "aria-hidden": true, style: { opacity: 0, pointerEvents: "none" } })}>
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} style={baseBtn}>
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} style={{ ...baseBtn, backgroundColor: "#ef4444", color: "#fff" }}>
                    Wrong Network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={openChainModal}
                    className="main-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "var(--accent)",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
                    {chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="main-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      borderRadius: "16px",
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "var(--foreground)",
                      fontFamily: "monospace",
                    }}
                  >
                    {account.displayName}
                    {account.displayBalance ? (
                      <span style={{ color: "var(--primary)" }}>{account.displayBalance}</span>
                    ) : null}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
