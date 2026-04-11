import { createClient } from '@supabase/supabase-js';

// هنسحب المفاتيح من الملف السري
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// إنشاء البوابة اللي هنستخدمها في كل الموقع
export const supabase = createClient(supabaseUrl, supabaseAnonKey);