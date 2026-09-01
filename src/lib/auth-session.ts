// حسم حالة الجلسة قبل أي قراءة مملوكة للمستخدم.
// getSession() ينتظر استعادة الجلسة ويجدّد الرمز المنتهي، فلا تُرسل طلبات
// غير مصرح بها إلى قاعدة البيانات قبل اكتمال الاستعادة.

import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export async function resolveSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session ?? null;
}
