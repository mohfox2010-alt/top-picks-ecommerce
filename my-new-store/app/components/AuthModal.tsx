"use client";
import { useState } from 'react';
import { useLang } from './LangContext'; // 1. استدعاء القاموس

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // 2. سحب t و lang من القاموس
  const { t, lang } = useLang();
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    // 3. جعل الاتجاه يعتمد على اللغة الحالية
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        
        {/* زر الإغلاق ديناميكي (يمين أو يسار حسب اللغة) */}
        <button onClick={onClose} className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-black tracking-tighter text-blue-600 mb-2">PICKS</div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isSignUp ? t.authSignUp : t.authSignIn}
          </h2>
          <p className="text-sm text-gray-500 mb-8 text-center">
            {isSignUp ? t.authSignUpDesc : t.authSignInDesc}
          </p>

          <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* اسم المستخدم */}
            <div className="relative">
              <input 
                type="text" 
                id="auth-username" 
                required 
                autoFocus          
                minLength={6}      
                maxLength={20}     
                className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                placeholder={t.authUsername} // الترجمة للـ Placeholder   
              />
              <label htmlFor="auth-username" className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[100%] ${lang === 'ar' ? 'right-0 peer-focus:right-0' : 'left-0 peer-focus:left-0'} peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>
                {t.authUsernameLabel}
              </label>
            </div>

            {/* البريد الإلكتروني */}
            {isSignUp && (
              <div className="relative mt-4">
                <input 
                  type="email" 
                  id="auth-email" 
                  required 
                  className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer text-left" 
                  dir="ltr" 
                  placeholder={t.authEmail} 
                />
                <label htmlFor="auth-email" className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[100%] ${lang === 'ar' ? 'right-0 peer-focus:right-0' : 'left-0 peer-focus:left-0'} peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>
                  {t.authEmail}
                </label>
              </div>
            )}

            {/* كلمة المرور */}
            <div className="relative mt-4">
              <input 
                type="password" 
                id="auth-password" 
                required 
                minLength={8}      
                maxLength={12}     
                className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer text-left" 
                dir="ltr" 
                placeholder={t.authPassword} 
              />
              <label htmlFor="auth-password" className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[100%] ${lang === 'ar' ? 'right-0 peer-focus:right-0' : 'left-0 peer-focus:left-0'} peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>
                {t.authPasswordLabel}
              </label>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-600">{t.authRemember}</span>
              </label>
              {!isSignUp && (
                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800">{t.authForgot}</a>
              )}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md">
                {isSignUp ? t.authConfirmSignUp : t.authSignIn}
              </button>
              
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full bg-transparent border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                {isSignUp ? t.authHaveAccount : t.authNoAccount}
              </button>
            </div>
            
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">{t.authOr}</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex flex-col gap-3">
              <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                {t.authGoogle}
              </button>
              <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                {t.authFacebook}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}