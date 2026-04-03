"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { categoriesList } from '../data/products';
import { useLang } from './LangContext'; 

export default function PageHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, tCat } = useLang(); // استدعاء tCat

  const viewParam = searchParams.get('view');
  const catsQuery = searchParams.get('cats');

  const categorySlugMatch = pathname?.match(/\/category\/(.+)/);
  const currentSlug = categorySlugMatch ? categorySlugMatch[1] : null;
  const isCategoriesView = viewParam === "categories";

  return (
    <div className="w-full flex flex-col mb-2">
      <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-[70px] sm:h-[170px] md:h-[270px] shadow-sm mb-8">
        <Image src="/banar.jpg" alt="Banner" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        <Link href="/" className={`px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-sm text-sm md:text-base ${pathname === '/' && !isCategoriesView && !catsQuery ? "bg-gray-900 text-white hover:bg-gray-800 scale-105" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
          {t.all}
        </Link>

        <Link href="/?view=categories" className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-sm md:text-base flex items-center gap-1.5 ${isCategoriesView ? "bg-blue-600 text-white hover:bg-blue-700 scale-105" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-blue-600"}`}>
          {t.categories}
        </Link>

        {categoriesList.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-sm md:text-base ${currentSlug === category.slug ? "bg-blue-600 text-white hover:bg-blue-700 scale-105" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-blue-600"}`}>
            {tCat(category.name)} {/* الترجمة هنا */}
          </Link>
        ))}
      </div>
    </div>
  );
}