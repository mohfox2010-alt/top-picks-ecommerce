"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';
import BestSellers from './components/BestSellers';
import AdBanner from './components/AdBanner';
import PageHeader from './components/PageHeader';
import TopPicksSection from './components/TopPicksSection';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { LangProvider } from './components/LangContext'; // استدعاء القاموس
export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith('/product/');

  return (
    <html lang="ar" dir="rtl" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased flex flex-col min-h-screen`}>
        
        {/* تغليف كل الموقع بخدمة الترجمة */}
        <LangProvider>
          <Navbar />

          <div className="flex flex-col flex-grow">
            <div className="max-w-[1500px] mx-auto w-full px-4 pb-8 pt-0 flex flex-col gap-8">
              
              <Suspense fallback={<div className="h-32"></div>}>
                <PageHeader />
              </Suspense>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {!isProductPage && (
                  <div className="w-full md:w-[260px] shrink-0 sticky top-24 hidden md:block">
                    <RightSidebar />
                  </div>
                )}
                <main className="flex-1 min-w-0">
                  {children}
                </main>
              </div>

              <div className="flex flex-col gap-[10px] w-full mt-4">
                {!isProductPage && <AdBanner />}
                <TopPicksSection />
                <BestSellers />
              </div>
            </div>
          </div>

          <Footer />
        </LangProvider>

      </body>
    </html>
  );
}