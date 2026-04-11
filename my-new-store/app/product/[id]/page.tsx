"use client";
import { supabase } from '../../../lib/supabase'; // مسار البوابة بتاعتنا
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = Number(params.id);

  // --- 1. حالات (States) جلب البيانات من قاعدة البيانات ---
  const [product, setProduct] = useState<any>(null); // هنخزن فيه بيانات المنتج
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState<string | null>(null); // لو حصل خطأ

  // --- 2. حالات (States) التحكم في واجهة المستخدم ---
  const [activeMedia, setActiveMedia] = useState('/banar.jpg'); // الصورة الكبيرة
  const [selectedColor, setSelectedColor] = useState('برتقالي كوزميك');
  const [selectedSize, setSelectedSize] = useState('256 GB');
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);

  // --- 3. سحب بيانات المنتج بناءً على الـ ID ---
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        // بنطلب من Supabase منتج واحد بس الـ id بتاعه بيساوي الـ productId اللي في الرابط
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single(); // single() عشان نضمن إنه يرجع عنصر واحد مش مصفوفة

        if (error) throw error;

        if (data) {
          setProduct(data);
          // أول ما البيانات تيجي، بنخلي الصورة الرئيسية هي صورة المنتج
          setActiveMedia(data.image_url || '/banar.jpg'); 
        } else {
          setError("عذراً، هذا المنتج غير متوفر.");
        }

      } catch (err) {
        console.error("مشكلة في جلب تفاصيل المنتج:", err);
        setError("حدث خطأ أثناء تحميل بيانات المنتج.");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // --- 4. واجهة التحميل ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <h1 className="text-2xl font-bold text-gray-500 animate-pulse">جاري تحميل تفاصيل المنتج...</h1>
      </div>
    );
  }

  // --- 5. واجهة الخطأ أو عدم وجود المنتج ---
  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-96 flex-col gap-4">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link href="/" className="text-blue-600 underline font-bold">العودة للرئيسية</Link>
      </div>
    );
  }

  // --- تجهيز البيانات للعرض ---
  // مصفوفة صور (بندمج صورة المنتج مع صور تجريبية لمعرض الصور)
  const gallery = [
    product.image_url, 
    '/banar.jpg',
    product.image_url,
  ];

  // مواصفات المنتج (دمجنا فيها البيانات الحقيقية من الداتابيز)
  const specifications = [
    { label: "اسم المنتج", value: product.name },
    { label: "القسم", value: product.category },
    { label: "التفاصيل", value: product.details || "لا توجد تفاصيل إضافية" },
    { label: "العلامة التجارية", value: "ابل (Apple)" }, // دي ثابتة للتجربة
    { label: "الضمان", value: "سنتين" },
  ];

  const displayedSpecs = showMoreSpecs ? specifications : specifications.slice(0, 3);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 max-w-6xl mx-auto my-4">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* ========================================= */}
        {/* الجانب الأيمن: معرض الصور */}
        {/* ========================================= */}
        <div className="w-full lg:w-1/2 flex gap-4">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] w-20 scrollbar-hide py-1">
            {gallery.map((img, index) => (
              <div 
                key={index} 
                onMouseEnter={() => setActiveMedia(img)} 
                className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeMedia === img ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-gray-400'}`}
              >
                {/* ضفنا شرط للتأكد من وجود الصورة عشان متعملش إيرور */}
                {img && <Image src={img} alt="صورة مصغرة" fill className="object-cover" />}
              </div>
            ))}
          </div>

          <div className="relative flex-1 h-[400px] md:h-[500px] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center">
            {activeMedia ? (
              <Image 
                src={activeMedia} 
                alt={product.name} 
                fill 
                className="object-contain p-4 transition-transform duration-500 hover:scale-110" 
                priority
              />
            ) : (
              <span className="text-gray-400">لا توجد صورة</span>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* الجانب الأيسر: تفاصيل المنتج */}
        {/* ========================================= */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          <div className="mb-6 border-b border-gray-100 pb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400 text-sm">
                ★★★★<span className="text-gray-300">★</span>
              </div>
              <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">(413 تقييم)</span>
            </div>
            {/* عرض وصف المنتج اللي جاي من الداتابيز */}
            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.details}
            </p>
          </div>

          <div className="mb-6 border-b border-gray-100 pb-6">
            <span className="block text-sm font-bold text-gray-900 mb-3">اللون: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'افتراضي', hex: '#E87D3E' },
                { name: 'أسود', hex: '#2A2A2C' },
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

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">المواصفات الأساسية</h3>
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

          <div className="flex-grow"></div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="w-1/3 border-2 border-blue-600 bg-blue-50 text-blue-600 rounded-2xl py-4 flex flex-col items-center justify-center font-black text-xl shadow-sm">
              {product.price} ر.س
            </div>
            
            <Link 
              href={product.affiliate_link || "#"} // ربطنا لينك أمازون من الداتابيز
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