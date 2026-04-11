"use client";
import { useState } from 'react';
import { useLang } from './LangContext'; 
import { supabase } from '../../lib/supabase'; 

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t, lang } = useLang();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!isOpen) return null;

  // 1. دالة التسجيل بالإيميل والباسورد
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ text: 'تم إنشاء الحساب بنجاح! جاري الدخول...', type: 'success' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      setTimeout(() => { onClose(); window.location.reload(); }, 1000);
    } catch (err: any) {
      setMessage({ text: err.message || 'حدث خطأ في البيانات', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة التسجيل بالشبكات الاجتماعية (Google, Facebook, Twitter)
  const handleOAuth = async (provider: 'google' | 'facebook' | 'twitter') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`, // يرجع للموقع بعد التسجيل
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ text: err.message || 'حدث خطأ في الاتصال', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-black tracking-tighter text-blue-600 mb-2">PICKS</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{isSignUp ? 'إنشاء حساب جديد' : t.authSignIn}</h2>
          
          {message.text && (
            <div className={`w-full text-sm p-3 mt-2 rounded-lg text-center border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form className="w-full space-y-4 mt-6" onSubmit={handleAuth}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-left" dir="ltr" placeholder="البريد الإلكتروني" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-left" dir="ltr" placeholder="كلمة المرور" />

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400">
              {loading ? "جاري المعالجة..." : (isSignUp ? 'إنشاء الحساب' : t.authSignIn)}
            </button>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage({text:'', type:''}); }} className="w-full bg-transparent text-blue-600 font-bold py-2 hover:underline text-sm">
              {isSignUp ? 'لدي حساب بالفعل (دخول)' : 'ليس لدي حساب (تسجيل جديد)'}
            </button>
          </form>

          {/* فاصل الشبكات الاجتماعية */}
          <div className="relative flex py-4 items-center w-full">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">أو المتابعة باستخدام</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* أزرار جوجل، فيسبوك، و تويتر (X) */}
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => handleOAuth('google')} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              Google
            </button>
            <button onClick={() => handleOAuth('facebook')} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button onClick={() => handleOAuth('twitter')} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.078z"/></svg>
              X (Twitter)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}