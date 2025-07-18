// lib/content.ts
import { db } from '@/lib/supabase';

// Fungsi ini akan mengubah array [{key: 'k', value: 'v'}] menjadi objek { k: 'v' }
export async function getSiteContentAsMap() {
  const { data } = await db.from('site_content').select('*');

  if (!data) {
    return {};
  }

  const contentMap = data.reduce((acc, item) => {
    acc[item.content_key] = item.content_value;
    return acc;
  }, {} as Record<string, string>);

  return contentMap;
}