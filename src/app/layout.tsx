import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import "./globals.css";

// 日本語フォント
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// 英語フォント
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intent Sales Platform | インテントセールス by Scalehack",
  description: "AIとデータドリブンで実現する、最適なタイミングでの営業アプローチ。Scalehackが提供するインテントセールスプラットフォーム。",
  keywords: ["インテントセールス", "営業支援", "Scalehack", "AI営業", "リード獲得"],
  authors: [{ name: "Scalehack" }],
  openGraph: {
    title: "Intent Sales Platform | インテントセールス by Scalehack",
    description: "AIとデータドリブンで実現する、最適なタイミングでの営業アプローチ",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
