"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/evm";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  // RainbowKit reads localStorage during render → mount client-side only so
  // static prerendering on the server doesn't crash.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        {mounted ? (
          <WagmiProvider config={wagmiConfig}>
            <RainbowKitProvider
              modalSize="compact"
              theme={darkTheme({
                accentColor: "#ccff00",
                accentColorForeground: "#0a0a0a",
                borderRadius: "medium",
                overlayBlur: "small",
              })}
            >
              {children}
              <Toaster position="bottom-right" richColors />
            </RainbowKitProvider>
          </WagmiProvider>
        ) : (
          <div style={{ minHeight: "100dvh" }} aria-hidden />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
