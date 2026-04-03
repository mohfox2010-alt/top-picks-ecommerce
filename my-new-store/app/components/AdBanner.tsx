"use client";

import Link from 'next/link';
import { useLang } from './LangContext';

export default function AdBanner() {
  const { t } = useLang();
  return (
    // التعديل: مسحنا المسافات الخارجية (Margins)
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📢</span>
        <h2 className="text-2xl font-extrabold text-gray-900">{t.promo}</h2>
      </div>
      
      <div className="w-full h-32 md:h-40 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-between px-8 text-white shadow-lg overflow-hidden relative group">
        <div className="z-10">
          <h3 className="text-xl md:text-3xl font-black mb-2">{t.promoDesc}!</h3>
          <p className="text-blue-100 text-sm md:text-base font-medium">{t.useCode}: <span className="bg-white/20 px-2 py-0.5 rounded font-bold">WELCOME20</span></p>
        </div>
        <Link href="#" className="z-10 bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-50 transition-all transform group-hover:scale-105 shadow-md">
        {t.shopNow}
        </Link>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}