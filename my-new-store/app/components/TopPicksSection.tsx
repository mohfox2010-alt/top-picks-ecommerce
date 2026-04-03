"use client"; // 1. أضفنا هذا السطر لأننا نستخدم Context
import { affiliateProducts } from '../data/products';
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from './LangContext'; // 2. استدعاء القاموس

export default function TopPicksSection() {
  const { t } = useLang(); // 3. استخدام القاموس

  // هنختار أفضل 3 منتجات يدوياً (مثلاً أرقام 5, 2, 8)
  const top3 = affiliateProducts.filter(p => [5, 2, 8].includes(p.id));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-xl">⭐</span>
            {t.topPicksTitle} {/* الترجمة هنا */}
          </h2>
          <p className="text-gray-500 mt-2">{t.topPicksDesc}</p> {/* الترجمة هنا */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((product, index) => (
          <div key={product.id} className="relative bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            
            {/* رقم الترتيب */}
            <div className="absolute top-6 left-6 z-10 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
              #{index + 1}
            </div>
            
            <Link href={`/product/${product.id}`} className="block relative h-64 w-full bg-gray-50 rounded-2xl overflow-hidden mb-4">
              <Image 
                src={product.imageUrl} 
                alt={product.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Link>
            
            <div className="px-2">
              <span className="text-xs font-bold text-blue-600 mb-2 block">{product.category}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{product.title}</h3>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-black text-gray-900">{product.price}</span>
                
                {/* تم توجيه الزر لصفحة التفاصيل واستخدام الترجمة */}
                <Link href={`/product/${product.id}`} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors text-sm">
                  {t.details}
                </Link>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}