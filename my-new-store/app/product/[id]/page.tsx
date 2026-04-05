"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { affiliateProducts } from '../../data/products';
import { useParams } from 'next/navigation';
export const runtime = 'edge';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = Number(params.id);
  
  // البحث عن المنتج في قاعدة البيانات المحلية
  const product = affiliateProducts.find((p) => p.id === productId);

  // --------------------------------------------------------
  // إعدادات المتغيرات (States) للتحكم في الصفحة
  // --------------------------------------------------------
  // 1 & 2. حالة الصورة النشطة (لتغييرها عند لمس الصور المصغرة)
  const [activeMedia, setActiveMedia] = useState(product?.imageUrl || '/banar.jpg');
  
  // 4. حالة اللون المختار
  const [selectedColor, setSelectedColor] = useState('برتقالي كوزميك');
  
  // 5. حالة الحجم المختار
  const [selectedSize, setSelectedSize] = useState('256 GB');
  
  // 6. حالة إظهار المزيد/الأقل في المواصفات
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);

  // إذا لم يتم العثور على المنتج
  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <h1 className="text-2xl font-bold text-gray-500">عذراً، المنتج غير موجود!</h1>
      </div>
    );
  }

  // مصفوفة صور وهمية لتشغيل معرض الصور (في مشروعك الحقيقي ستجلبها من قاعدة البيانات)
  const gallery = [
    product.imageUrl,
    '/banar.jpg',
    product.imageUrl,
    '/banar.jpg'
  ];

  // مواصفات وهمية للتجربة
  const specifications = [
    { label: "العلامة التجارية", value: "ابل (Apple)" },
    { label: "أنظمة التشغيل", value: "iOS 17" },
    { label: "سعة تخزين الذاكرة", value: "256 جيجابايت" },
    { label: "حجم الشاشة", value: "6.7 انش" },
    { label: "الدقة", value: "1290 × 2796" },
    { label: "اسم الطراز", value: "ايفون 17 برو ماكس" },
    { label: "التكنولوجيا الخلوية", value: "5G" },
  ];

  const displayedSpecs = showMoreSpecs ? specifications : specifications.slice(0, 4);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 max-w-6xl mx-auto my-4">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* ========================================= */}
        {/* الجانب الأيمن: معرض الصور (الرقم 1 و 2) */}
        {/* ========================================= */}
        <div className="w-full lg:w-1/2 flex gap-4">
          {/* 1. الصور المصغرة عمودياً */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] w-20 scrollbar-hide py-1">
            {gallery.map((img, index) => (
              <div 
                key={index} 
                onMouseEnter={() => setActiveMedia(img)} // التغيير بمجرد الإشارة بالماوس
                className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeMedia === img ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <Image src={img} alt="صورة مصغرة" fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* 2. الصورة الرئيسية الكبيرة */}
          <div className="relative flex-1 h-[400px] md:h-[500px] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
            <Image 
              src={activeMedia} 
              alt={product.title} 
              fill 
              className="object-contain p-4 transition-transform duration-500 hover:scale-110" 
              priority
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* الجانب الأيسر: تفاصيل المنتج (الأرقام 3 إلى 8) */}
        {/* ========================================= */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          {/* 3. اسم المنتج والتقييم */}
          <div className="mb-6 border-b border-gray-100 pb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{product.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400 text-sm">
                ★★★★<span className="text-gray-300">★</span>
              </div>
              <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">(413 تقييم)</span>
            </div>
          </div>

          {/* 4. الألوان المتاحة */}
          <div className="mb-6 border-b border-gray-100 pb-6">
            <span className="block text-sm font-bold text-gray-900 mb-3">اللون: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'برتقالي كوزميك', hex: '#E87D3E' },
                { name: 'أسود تيتانيوم', hex: '#2A2A2C' },
                { name: 'أبيض', hex: '#F4F4F4' }
              ].map((color) => (
                <button 
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-blue-600 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* 5. حجم المنتج / السعة */}
          <div className="mb-6 border-b border-gray-100 pb-6">
            <span className="block text-sm font-bold text-gray-900 mb-3">الحجم: <span className="text-gray-500 font-normal">{selectedSize}</span></span>
            <div className="flex flex-wrap gap-3">
              {['256 GB', '512 GB', '1 TB'].map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded-xl font-bold border-2 transition-all ${selectedSize === size ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 6. مواصفات المنتج (عرض المزيد / عرض أقل) */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">المواصفات</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {displayedSpecs.map((spec, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-900">{spec.label}</span>
                  <span className="w-2/3 text-gray-600">{spec.value}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setShowMoreSpecs(!showMoreSpecs)}
              className="mt-3 text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
            >
              {showMoreSpecs ? 'عرض أقل ˄' : 'عرض المزيد ˅'}
            </button>
          </div>

          {/* المسافة المرنة لدفع الأزرار للأسفل */}
          <div className="flex-grow"></div>

          {/* 7 & 8. السعر وزر الشراء */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
            {/* 7. السعر (تصميم زر أزرق) */}
            <div className="w-1/3 border-2 border-blue-600 bg-blue-50 text-blue-600 rounded-2xl py-4 flex flex-col items-center justify-center font-black text-xl shadow-sm">
              {product.price}
            </div>
            
            {/* 8. زر الشراء */}
            <Link 
              href={product.affiliateLink} 
              target="_blank"
              className="w-2/3 bg-blue-600 text-white rounded-2xl py-4 flex items-center justify-center font-black text-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              شراء الآن 🛒
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}