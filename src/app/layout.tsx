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
  title: "VeilPay - True Private Payments on HashKey Chain",
  description: "Send and receive shielded payments using ERC-5564 stealth addresses on HashKey Chain. Your main wallet never appears on the transaction; share a view key for compliance.",
  keywords: ["defi", "privacy", "stealth address", "ERC-5564", "HashKey Chain", "HSK", "private payments", "view key"],
  authors: [{ name: "VeilPay" }],
  openGraph: {
    title: "VeilPay - True Private Payments",
    description: "Shielded stealth-address payments on HashKey Chain.",
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

