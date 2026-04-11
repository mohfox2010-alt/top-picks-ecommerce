"use client";

import { supabase } from '../../../lib/supabase';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { categoriesList } from '../../data/products';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug; 

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryObj = categoriesList.find(c => c.slug === categorySlug);
  const categoryArabicName = categoryObj ? categoryObj.name : '';

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!categoryArabicName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', categoryArabicName)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("مشكلة في جلب منتجات القسم:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [categoryArabicName]);

  if (loading) {
    return <div className="text-center py-32 text-gray-500 font-bold text-xl">جاري تحميل القسم...</div>;
  }

  if (!categoryArabicName) {
    return <div className="text-center py-32 text-red-500 font-bold text-xl">عذراً، هذا القسم غير موجود!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12" dir="rtl">
      
      {/* تم مسح عنوان القسم من هنا بناءً على طلبك لتنظيف التصميم */}

      {/* لو القسم مفيهوش منتجات */}
      {products.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-3xl border border-dashed border-gray-300 mt-10">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">لا توجد منتجات حالياً</h2>
          <p className="text-gray-500 mb-6">سنقوم بإضافة منتجات جديدة لهذا القسم قريباً جداً.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">
            العودة للرئيسية
          </Link>
        </div>
      ) : (
        /* عرض منتجات القسم فقط */
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id} 
              title={product.name}          
              description={product.details} 
              price={product.price}         
              imageUrl={product.image_url}  
            />
          ))}
        </div>
      )}
    </div>
  );
}