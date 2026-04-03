"use client";
import Link from 'next/link';
import { useLang } from './LangContext'; // استدعاء الترجمة

export default function Footer() {
  const { t } = useLang(); // استخدام القاموس

  return (
    <footer className="bg-gray-900 text-white rounded-t-[2.5rem] mt-auto py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-black mb-4 tracking-tighter">
              <span className="text-blue-500">TOP</span> PICKS
            </h3>
            <p className="text-gray-400 text-xs leading-loose">
              {t.storeDesc}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">{t.quickLinks}</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-white">{t.home}</Link></li>
              <li><Link href="/?view=categories" className="hover:text-white">{t.categories}</Link></li>
              <li><Link href="#" className="hover:text-white">{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">{t.legal}</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="#" className="hover:text-white">{t.privacyPolicy}</Link></li>
              <li><Link href="#" className="hover:text-white">{t.termsConditions}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">{t.newsletter}</h4>
            <div className="flex gap-2">
              <input type="email" placeholder={t.newsletterPlaceholder} className="bg-gray-800 border-none rounded-lg px-3 py-2 text-xs w-full focus:ring-1 focus:ring-blue-500"/>
              <button className="bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">{t.subscribe}</button>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-[10px]">
          {t.rights} {new Date().getFullYear()} PICKS
        </div>
      </div>
    </footer>
  );
}