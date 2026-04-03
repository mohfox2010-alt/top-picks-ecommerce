"use client";
import React, { createContext, useContext, useState } from 'react';

type Lang = 'ar' | 'en';

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: any; 
  tCat: (arabicName: string) => string; // الدالة الجديدة لترجمة الأقسام
}

const translations = {
  ar: {
    useCode: "استخدم الكود:",
    home: "الرئيسية",
    categories: "الأقسام",
    contact: "اتصل بنا",
    searchPlaceholder: "ابحث عن منتج...",
    register: "التسجيل / الدخول",
    langToggle: "English",
    all: "الكل",
    bestSellers: "المنتجات الأكثر مبيعاً",
    buyNow: "شراء الآن",
    details: "عرض التفاصيل",
    noProducts: "لم نتمكن من العثور على منتجات. جرب فلاتر أخرى!",
    promo: "عروض ترويجية",
    promoDesc: "خصم 20% على أول طلب!",
    shopNow: "تسوق الآن",
    topPicksTitle: "أفضل اختياراتنا هذا الأسبوع",
    topPicksDesc: "منتجات تم اختيارها بعناية بناءً على التقييمات والسعر",
    footerAbout: "عن متجرنا",
    footerDesc: "وجهتك الأولى لتسوق أفضل المنتجات بأسعار تنافسية وجودة عالية.",
    quickLinks: "روابط سريعة",
    customerService: "خدمة العملاء",
    rights: "جميع الحقوق محفوظة ©",
    filterTitle: "تصفية النتائج",
    searchProduct: "بحث باسم المنتج",
    searchPlaceholderFilters: "ابحث هنا...",
    priceUpTo: "السعر: حتى",
    seller: "البائع",
    amazon: "أمازون (Amazon)",
    noon: "نون (Noon)",
    authSignUp: "إنشاء حساب جديد",
    authSignIn: "تسجيل الدخول",
    authSignUpDesc: "انضم إلينا واكتشف أفضل العروض الحصرية",
    authSignInDesc: "مرحباً بعودتك! سجل دخولك للمتابعة",
    authUsername: "اسم المستخدم",
    authUsernameLabel: "أســـم الدخول",
    authEmail: "البريد الإلكتروني",
    authPassword: "كلمة المرور",
    authPasswordLabel: "الرقـــم السرى",
    authRemember: "تذكرني",
    authForgot: "نسيت كلمة المرور؟",
    authConfirmSignUp: "تأكيد وإنشاء الحساب",
    authHaveAccount: "لديك حساب بالفعل؟ تسجيل الدخول",
    authNoAccount: "ليس لديك حساب؟ إنشاء حساب جديد",
    authOr: "أو",
    authGoogle: "المتابعة باستخدام Google",
    authFacebook: "المتابعة باستخدام Facebook"
  },
  en: {
    useCode: "Use code:",
    home: "Home",
    categories: "Categories",
    contact: "Contact Us",
    searchPlaceholder: "Search for a product...",
    register: "Sign In / Up",
    langToggle: "العربية",
    all: "All",
    bestSellers: "Best Sellers",
    buyNow: "Buy Now",
    details: "View Details",
    noProducts: "No products found. Try adjusting your filters!",
    promo: "Promotional Offers",
    promoDesc: "20% off your first order!",
    shopNow: "Shop Now",
    topPicksTitle: "Our Top Picks This Week",
    topPicksDesc: "Carefully selected products based on ratings and price",
    footerAbout: "About Us",
    footerDesc: "Your premier destination for shopping the best products at competitive prices.",
    quickLinks: "Quick Links",
    customerService: "Customer Service",
    rights: "All rights reserved ©",
    filterTitle: "Filter Results",
    searchProduct: "Search by Product",
    searchPlaceholderFilters: "Search here...",
    priceUpTo: "Price: Up to",
    seller: "Seller",
    amazon: "Amazon",
    noon: "Noon",
    authSignUp: "Create an Account",
    authSignIn: "Sign In",
    authSignUpDesc: "Join us to discover exclusive offers",
    authSignInDesc: "Welcome back! Please sign in to continue",
    authUsername: "Username",
    authUsernameLabel: "Username",
    authEmail: "Email Address",
    authPassword: "Password",
    authPasswordLabel: "Password",
    authRemember: "Remember me",
    authForgot: "Forgot password?",
    authConfirmSignUp: "Confirm & Create Account",
    authHaveAccount: "Already have an account? Sign In",
    authNoAccount: "Don't have an account? Sign Up",
    authOr: "Or",
    authGoogle: "Continue with Google",
    authFacebook: "Continue with Facebook"
  }
};

// قاموس الأقسام
const categoryTranslations: Record<string, string> = {
  "العطور والتجميل": "Perfumes & Beauty",
  "الإلكترونيات والجوالات": "Electronics & Phones",
  "أجهزة المنزل الذكية": "Smart Home",
  "أزياء وإكسسوارات": "Fashion & Accessories",
  "الجيم المنزلي والمكملات": "Home Gym & Supplements"
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  // الدالة الذكية لترجمة الأقسام
  const tCat = (arabicName: string) => {
    if (lang === 'ar') return arabicName;
    return categoryTranslations[arabicName] || arabicName;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: translations[lang], tCat }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within LangProvider");
  return context;
}