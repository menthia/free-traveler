import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { ToastProvider } from "@/lib/toast-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Traveler",
  description:
    "여행지 탐색, 항공·숙소 조건 정리, 동행 매칭, 국가 안전정보를 한 곳에서 제공하는 여행 준비 허브",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#262425]">
        <ToastProvider>
          <GlobalHeader />
          <main className="flex-1">{children}</main>
          <GlobalFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
