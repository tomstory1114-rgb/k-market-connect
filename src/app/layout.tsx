import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { CartProvider } from '@/contexts/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'K-Market Connect | 해외 한인을 위한 구매대행 플랫폼',
  description: '한국 쇼핑, 세계 어디서나. 구매대행부터 커뮤니티까지 한 곳에서 해결하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <FavoritesProvider>
          <CartProvider>
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
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}