"use client";
import { Suspense } from 'react';
import { categoriesList } from '../data/products';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLang } from './LangContext';

function RightSidebarContent() {
  const [price, setPrice] = useState(1000);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang, tCat } = useLang();

  const currentSlug = params?.slug as string;
  const catsQuery = searchParams.get('cats');

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (catsQuery) {
      setSelectedCategories(catsQuery.split(','));
    } else if (currentSlug) {
      setSelectedCategories([currentSlug]);
    } else {
      setSelectedCategories([]);
    }
  }, [currentSlug, catsQuery]);

  const handleCategoryChange = (slug: string) => {
    let newSelected = [...selectedCategories];
    if (newSelected.includes(slug)) newSelected = newSelected.filter(c => c !== slug);
    else newSelected.push(slug);

    if (newSelected.length === 0) router.push('/');
    else if (newSelected.length === 1) router.push(`/category/${newSelected[0]}`);
    else router.push(`/?cats=${newSelected.join(',')}`);
  };

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="font-extrabold text-xl mb-6 text-gray-900 border-b pb-4">{t.filterTitle}</h2>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">{t.searchProduct}</label>
        <input type="text" placeholder={t.searchPlaceholderFilters} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">{t.categories}</label>
        <div className="space-y-3">
          {categoriesList.map((category) => (
            <label key={category.slug} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedCategories.includes(category.slug)} onChange={() => handleCategoryChange(category.slug)} className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer focus:ring-blue-500" />
              <span className={`text-sm transition-colors ${selectedCategories.includes(category.slug) ? "text-blue-600 font-bold" : "text-gray-600 group-hover:text-blue-600"}`}>
                {tCat(category.name)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">{t.priceUpTo} {price} {lang === 'ar' ? 'ر.س' : 'SAR'}</label>
        <input type="range" min="10" max="5000" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>10 {lang === 'ar' ? 'ر.س' : 'SAR'}</span><span>5000 {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">{t.seller}</label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" /><span className="text-sm text-gray-600">{t.amazon}</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /><span className="text-sm text-gray-600">{t.noon}</span></label>
        </div>
      </div>
    </aside>
  );
}

export default function RightSidebar() {
  return (
    <Suspense fallback={<aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div><div className="h-32 bg-gray-200 rounded mb-6"></div></aside>}>
      <RightSidebarContent />
    </Suspense>
  );
}