"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { categoriesList } from '../data/products';
import AuthModal from './AuthModal';
import { useLang } from './LangContext'; // استدعاء خدمة الترجمة

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // سحب اللغة الحالية، دالة التغيير، والكلمات المترجمة
  const { lang, toggleLang, t, tCat } = useLang();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      router.push(`/?q=${searchQuery}`); 
    } else {
      router.push(`/`); 
    }
  };

  return (
    <>
      <header className="fixed top-4 inset-x-4 max-w-[1500px] mx-auto z-[100] bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 rounded-2xl transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            <div className="flex items-center gap-8">
              {/* لوجو Top Picks */}
              <Link href="/" className="flex items-center gap-1.5 group">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg px-2.5 py-1 rounded-lg transform -skew-x-12 shadow-md group-hover:scale-105 transition-transform">
                  <span className="block transform skew-x-12 tracking-wider">TOP</span>
                </div>
                <span className="text-gray-900 font-extrabold text-2xl tracking-tighter">PICKS</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 mb-4"></span>
              </Link>

              <nav className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm font-medium">
                  {/* استخدام الكلمات المترجمة (t.home) */}
                  <li><Link className="text-gray-600 transition hover:text-blue-600" href="/">{t.home}</Link></li>
                  
                  <li className="relative group py-4">
                    <button className="flex items-center gap-1 text-gray-600 transition hover:text-blue-600">
                      {t.categories}
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    <div className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} top-full mt-0 w-52 rounded-xl border border-gray-100 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50`}>
                      <div className="p-2">
                        {categoriesList.map((category) => (
                          <Link key={category.slug} href={`/category/${category.slug}`} className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-700">
                            {/* هنا إذا كان لديك أسماء أقسام بالإنجليزية في بياناتك يمكنك عرضها بناءً على lang */}
                            {tCat(category.name)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>

                  {/* زر تغيير اللغة متصل بالدالة المركزية */}
                  <li>
                    <button onClick={toggleLang} className="text-xs font-bold bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 text-gray-700 transition-colors">
                      {t.langToggle}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="hidden md:flex flex-1 max-w-xs mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-1.5 px-4 text-xs focus:border-blue-500 focus:outline-none"
                />
              </form>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                {t.register}
              </button>
            </div>
            
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}