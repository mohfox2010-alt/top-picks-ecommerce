"use client"; // 1. أضفنا هذا السطر لأننا نستخدم hook

import { affiliateProducts } from '../data/products';
import ProductCard from './ProductCard';
import { useLang } from './LangContext'; // 2. استدعاء الترجمة

export default function BestSellers() {
  const { t } = useLang(); // 3. استخدام القاموس

  // هناخد أول 4 منتجات نعرضهم كأكثر مبيعاً
  const topProducts = affiliateProducts.slice(0, 4);

  return (
    // التعديل: مسحنا mt-16 وخلينا الخط الفاصل أقرب شوية
    <div className="w-full border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🔥</span>
        {/* 4. تبديل النص الثابت بالنص المترجم من القاموس */}
        <h2 className="text-3xl font-extrabold text-gray-900">{t.bestSellers}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topProducts.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}