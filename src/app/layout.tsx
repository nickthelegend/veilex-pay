import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NetworkGuard from "@/components/NetworkGuard";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "VeilPay - Smart Private Payments & Micro-Investing",
  description: "Round up your spending and invest in your future privately. The world's first stealth DeFi micro-investment platform on Conflux.",
  keywords: ["defi", "privacy", "stealth address", "conflux", "crypto", "investing", "round-up", "payments"],
  authors: [{ name: "VeilPay" }],
  openGraph: {
    title: "VeilPay - Smart Private Payments",
    description: "Secure, private, and automated micro-investments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} ${nunito.variable} antialiased`}>
        <Providers>
          <NetworkGuard>
            {children}
          </NetworkGuard>
        </Providers>
      </body>
    </html>
  );
}

