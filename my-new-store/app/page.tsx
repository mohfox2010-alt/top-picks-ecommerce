"use client";

import { Suspense } from 'react';
import ProductCard from './components/ProductCard';
import { affiliateProducts, categoriesList } from './data/products';
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

  const filteredProducts = affiliateProducts.filter(product => {
    const productCatObj = categoriesList.find(c => c.name === product.category);
    const productSlug = productCatObj ? productCatObj.slug : '';

    let matchesCategory = true;
    if (selectedCatsArray.length > 0) {
      matchesCategory = selectedCatsArray.includes(productSlug);
    }

    const matchesSearch = product.title.includes(searchQuery) || product.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (viewParam === "categories") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((category) => {
          const categoryProducts = affiliateProducts.filter(p => p.slug === category.slug);
          const displayImage = categoryProducts.length > 0 ? categoryProducts[0].imageUrl : null;
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

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg bg-gray-50 rounded-lg border border-dashed border-gray-300">
        {t.noProducts}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} id={product.id} title={product.title} description={product.description} price={product.price} imageUrl={product.imageUrl} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">جاري التحميل...</div>}>
      <HomeContent />
    </Suspense>
  );
}