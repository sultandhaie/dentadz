import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "DentaDZ",
  description: "Tableau de bord pour cabinet dentaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${cairo.variable} h-full`}
    >
      <body
        className={`${inter.className} flex min-h-full flex-col bg-[#F8FAFC] font-sans text-[#0F172A] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
