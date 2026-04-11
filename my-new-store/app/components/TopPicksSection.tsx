"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // استدعاء قاعدة البيانات
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from './LangContext'; 

export default function TopPicksSection() {
  const { t, lang } = useLang();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // سحب أحدث 4 منتجات من قاعدة البيانات لعرضهم في هذا القسم
  useEffect(() => {
    async function fetchTopPicks() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }) // ترتيب من الأحدث للأقدم
          .limit(4); // جلب 4 منتجات فقط كعينة لأفضل الاختيارات

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("مشكلة في جلب أفضل الاختيارات:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPicks();
  }, []);

  // عدم عرض القسم أثناء التحميل أو إذا لم تكن هناك منتجات
  if (loading || products.length === 0) return null;

  return (
    <section className="py-12 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900">
          {lang === 'ar' ? 'أفضل اختياراتنا لك ✨' : 'Top Picks For You ✨'}
        </h2>
        <Link href="/" className="text-blue-600 font-bold hover:underline text-sm bg-blue-50 px-4 py-2 rounded-lg transition-colors">
          {lang === 'ar' ? 'عرض الكل' : 'View All'}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <Link href={`/product/${p.id}`} key={p.id} className="group block">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              
              <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <Image 
                  src={p.image_url || '/banar.jpg'} 
                  alt={p.name} 
                  fill 
                  className="object-contain transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  {p.category}
                </span>
                <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug mb-2">
                  {p.name}
                </h3>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                  <p className="text-blue-600 font-black text-lg">
                    {p.price} <span className="text-xs">{p.currency || 'ر.س'}</span>
                  </p>
                  <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}