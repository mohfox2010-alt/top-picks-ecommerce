"use client";

import { supabase } from '../lib/supabase';
import { Suspense, useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import { categoriesList } from './data/products'; // لسة محتاجين الأقسام من هنا
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLang } from './components/LangContext';

function HomeContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const catsQuery = searchParams.get('cats');
  const searchQuery = searchParams.get('q') || ''; 
  const { t, tCat } = useLang();

  const selectedCatsArray = catsQuery ? catsQuery.split(',') : [];

  // --- حالات (States) الاتصال بقاعدة البيانات ---
  const [products, setProducts] = useState<any[]>([]); // المنتجات هتيجي هنا
  const [loading, setLoading] = useState(true); // جاري التحميل

  // سحب البيانات من Supabase أول ما الصفحة تفتح
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // سحب كل المنتجات من جدول products
        const { data, error } = await supabase.from('products').select('*');
        
        if (error) {
          console.error("مشكلة في جلب المنتجات:", error);
        } else {
          setProducts(data || []);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // القوسين دول بيخلوا السحب يحصل مرة واحدة بس

  // --- فلترة المنتجات اللي جت من قاعدة البيانات ---
  const filteredProducts = products.filter(product => {
    // التأكد من تطابق القسم
    const productCatObj = categoriesList.find(c => c.name === product.category);
    const productSlug = productCatObj ? productCatObj.slug : '';

    let matchesCategory = true;
    if (selectedCatsArray.length > 0) {
      matchesCategory = selectedCatsArray.includes(productSlug);
    }

    // البحث بالاسم أو التفاصيل (بناءً على أسماء الأعمدة في الداتابيز)
    const matchesSearch = 
      (product.name && product.name.includes(searchQuery)) || 
      (product.details && product.details.includes(searchQuery));
      
    return matchesCategory && matchesSearch;
  });

  // --- واجهة التحميل ---
  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-bold text-xl">جاري تحميل أحدث المنتجات...</div>;
  }

  // --- عرض الأقسام (كما هي) ---
  if (viewParam === "categories") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((category) => {
          // فلترة المنتجات عشان نجيب صورة للقسم
          const categoryProducts = products.filter(p => {
             const catObj = categoriesList.find(c => c.name === p.category);
             return catObj && catObj.slug === category.slug;
          });
          
          const displayImage = categoryProducts.length > 0 ? categoryProducts[0].image_url : category.imageUrl;
          
          return (
            <Link key={category.slug} href={`/category/${category.slug}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 bg-white">
              <div className="relative h-64 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                {displayImage ? (
                  <Image src={displayImage} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <div className="text-gray-400 font-medium">قريباً...</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h2 className="text-2xl font-extrabold mb-1 drop-shadow-lg">
                    {tCat(category.name)}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  // --- في حالة عدم وجود منتجات ---
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg bg-gray-50 rounded-lg border border-dashed border-gray-300">
        {t.noProducts}
      </div>
    );
  }

  // --- عرض المنتجات اللي تم فلترتها ---
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          id={product.id} 
          title={product.name}          // ربطنا name اللي في الداتابيز
          description={product.details} // ربطنا details اللي في الداتابيز
          price={product.price}         // ربطنا price اللي في الداتابيز
          imageUrl={product.image_url}  // ربطنا image_url اللي في الداتابيز
        />
      ))}
    </div>
  );
}

// export const runtime = 'edge'; // موقفينها حالياً عشان بيئة التطوير

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">جاري التحميل الأولي...</div>}>
      <HomeContent />
    </Suspense>
  );
}// تحديث جديد