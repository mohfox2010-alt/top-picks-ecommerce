"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoriesList } from '../data/products';
import AuthModal from './AuthModal';
import { useLang } from './LangContext'; 
import { supabase } from '../../lib/supabase'; // استدعاء Supabase

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // هنخزن فيه بيانات المدير لو مسجل دخول
  
  const { lang, toggleLang, t, tCat } = useLang();

  // فحص حالة تسجيل الدخول أول ما الموقع يفتح
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // متابعة أي تغيير (لو عمل تسجيل خروج مثلا)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      router.push(`/?q=${searchQuery}`); 
    } else {
      router.push(`/`); 
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // يرجع للرئيسية بعد الخروج
  };

  return (
    <>
      <header className="fixed top-4 inset-x-4 max-w-[1500px] mx-auto z-[100] bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 rounded-2xl transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            {/* اللوجو والروابط كما هي */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-1.5 group">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg px-2.5 py-1 rounded-lg transform -skew-x-12 shadow-md group-hover:scale-105 transition-transform">
                  <span className="block transform skew-x-12 tracking-wider">TOP</span>
                </div>
                <span className="text-gray-900 font-extrabold text-2xl tracking-tighter">PICKS</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 mb-4"></span>
              </Link>

              <nav className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm font-medium">
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
                            {tCat(category.name)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>

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

            {/* هنا السحر: تغيير الأزرار بناءً على حالة تسجيل الدخول */}
            <div className="flex items-center gap-3">
              {user ? (
                // لو مسجل دخول (أنت المدير)
                <>
                  <Link 
                    href="/admin" 
                    className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <span>لوحة التحكم</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                  >
                    خروج
                  </button>
                </>
              ) : (
                // لو مش مسجل دخول (زائر عادي)
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
                >
                  {t.register}
                </button>
              )}
            </div>
            
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}