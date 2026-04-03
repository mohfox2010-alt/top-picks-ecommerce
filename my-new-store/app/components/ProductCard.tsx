"use client"; // إضافة use client
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from './LangContext'; // استدعاء الترجمة

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

export default function ProductCard({ id, title, description, price, imageUrl }: ProductCardProps) {
  const { t } = useLang(); // استخدام القاموس

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      
      <Link href={`/product/${id}`} className="relative h-48 w-full bg-gray-50 overflow-hidden block">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-grow">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-lg font-black text-gray-900">{price}</span>
          
          <Link 
            href={`/product/${id}`} 
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all"
          >
            {t.details} {/* الترجمة هنا */}
          </Link>
        </div>
      </div>
      
    </div>
  );
}