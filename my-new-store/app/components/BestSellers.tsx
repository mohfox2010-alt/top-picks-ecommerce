"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // الاتصال بقاعدة البيانات
import ProductCard from './ProductCard'; // استدعاء كارت المنتج
import { useLang } from './LangContext'; 

export default function BestSellers() {
  const { t, lang } = useLang();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // سحب منتجات من قاعدة البيانات لعرضها في قسم "الأكثر مبيعاً"
  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          // هنجيب 4 منتجات كمثال للأكثر مبيعاً
          .limit(4); 

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("مشكلة في جلب المنتجات الأكثر مبيعاً:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBestSellers();
  }, []);

  // إخفاء القسم لو لسة بيحمل أو لو مفيش منتجات
  if (loading || products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900">
          {lang === 'ar' ? 'الأكثر مبيعاً 🔥' : 'Best Sellers 🔥'}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            id={product.id} 
            title={product.name}          
            description={product.details} 
            // دمجنا السعر مع العملة اللي ضفناها في لوحة التحكم
            price={`${product.price} ${product.currency || 'ر.س'}`} 
            imageUrl={product.image_url}  
          />
        ))}
      </div>
    </section>
  );
}