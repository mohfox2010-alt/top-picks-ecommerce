"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 🛑 هام جداً: اكتب إيميلك هنا عشان محدش من الجمهور يقدر يدخل اللوحة غيرك!
const ADMIN_EMAIL = 'moh.fox.2010@gmail.com'; 

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null); // حالة التعديل

  const [formData, setFormData] = useState({
    name: '', price: '', currency: 'ر.س', category: 'العطور والتجميل', brand: '', details: '', affiliate_link: ''
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== ADMIN_EMAIL) {
        alert('غير مصرح لك بدخول هذه الصفحة!');
        router.push('/');
      } else {
        setUser(session.user);
        fetchProducts();
      }
      setLoadingAuth(false);
    };
    init();
  }, [router]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let publicImageUrl = undefined;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        publicImageUrl = urlData.publicUrl;
      }

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        currency: formData.currency,
        category: formData.category,
        brand: formData.brand,
        details: formData.details,
        affiliate_link: formData.affiliate_link,
        ...(publicImageUrl && { image_url: publicImageUrl }) // تحديث الصورة فقط لو تم رفع صورة جديدة
      };

      if (editId) {
        // تحديث منتج موجود
        await supabase.from('products').update(productData).eq('id', editId);
        alert('تم تعديل المنتج بنجاح!');
      } else {
        // إضافة منتج جديد
        await supabase.from('products').insert([productData]);
        alert('تمت الإضافة بنجاح!');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert('حدث خطأ في العملية');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (p: any) => {
    setEditId(p.id);
    setFormData({
      name: p.name, price: p.price, currency: p.currency || 'ر.س', category: p.category, brand: p.brand || '', details: p.details, affiliate_link: p.affiliate_link
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // يطلع الشاشة لفوق
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      if (imageUrl) {
        const path = imageUrl.split('/').pop();
        if (path) await supabase.storage.from('product-images').remove([path]);
      }
      fetchProducts();
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', price: '', currency: 'ر.س', category: 'العطور والتجميل', brand: '', details: '', affiliate_link: '' });
    setImageFile(null);
  };

  if (loadingAuth) return <div className="text-center py-20 font-bold">جاري التحقق من الصلاحيات... 🛡️</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 max-w-7xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-black mb-8 text-indigo-900">إدارة المتجر الاحترافية ⚙️</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* نموذج الإضافة / التعديل */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-24">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className={`font-bold text-xl ${editId ? 'text-orange-500' : 'text-blue-600'}`}>
              {editId ? '✏️ تعديل المنتج' : '📦 إضافة منتج جديد'}
            </h2>
            {editId && <button onClick={resetForm} className="text-sm text-gray-500 hover:text-red-500">إلغاء التعديل ✕</button>}
          </div>

          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <input required placeholder="اسم المنتج" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none" />
            
            <div className="flex gap-2">
              <input required type="number" placeholder="السعر" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-2/3 p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none" />
              <input required placeholder="العملة (ر.س، $، الخ)" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-1/3 p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none text-center" />
            </div>

            <div className="flex gap-2">
              {/* قسم جديد أو حالي */}
              <input list="categories" required placeholder="اكتب أو اختر القسم..." value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-1/2 p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none" />
              <datalist id="categories">
                <option value="العطور والتجميل" />
                <option value="الإلكترونيات والجوالات" />
                <option value="أجهزة المنزل الذكية" />
                <option value="أزياء وإكسسوارات" />
                <option value="الجيم المنزلي والمكملات" />
              </datalist>

              <input placeholder="الماركة (اختياري)" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-1/2 p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none" />
            </div>
            
            <div className="p-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <label className="block text-xs font-bold text-gray-500 mb-2">{editId ? 'تغيير الصورة (اختياري)' : 'صورة المنتج'}</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>

            <textarea required placeholder="وصف المنتج..." value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none h-24" />
            <input required placeholder="رابط أمازون (Affiliate)" value={formData.affiliate_link} onChange={e => setFormData({...formData, affiliate_link: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm border focus:border-blue-500 outline-none text-left" dir="ltr" />
            
            <button disabled={submitting} className={`w-full py-4 text-white font-black rounded-xl shadow-md transition-all ${editId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {submitting ? 'جاري الحفظ...' : (editId ? 'تحديث البيانات 🔄' : 'نشر المنتج 🚀')}
            </button>
          </form>
        </div>

        {/* قائمة المنتجات على اليسار */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="font-bold text-xl mb-6 flex justify-between items-center">
            المنتجات المعروضة ({products.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="flex flex-col p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                    <Image src={p.image_url || '/banar.jpg'} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">{p.name}</h3>
                    <p className="text-blue-600 font-black text-sm mt-1">{p.price} <span className="text-xs">{p.currency || 'ر.س'}</span></p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded-full">{p.category}</span>
                  </div>
                </div>
                
                {/* أزرار التحكم */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-200/60">
                  <button onClick={() => handleEditClick(p)} className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
                    ✏️ تعديل
                  </button>
                  <button onClick={() => handleDelete(p.id, p.image_url)} className="flex-1 bg-white border border-gray-200 text-red-500 text-xs font-bold py-2 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}