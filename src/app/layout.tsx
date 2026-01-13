import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "K-Market Connect | 해외 한인을 위한 구매대행 플랫폼",
  description: "한국 제품을 전 세계로! 쇼핑, 커뮤니티, 배송까지 한번에",
  keywords: "구매대행, 해외배송, 한인커뮤니티, K-마켓, 나우물류",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}