import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY tanımlı değil. .env dosyasını kontrol et."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Bir Storage bucket'ına dosya yükler ve herkese açık URL'sini döndürür.
 * @param {string} bucket - "activity-photos" | "partner-logos"
 * @param {File} file - yüklenecek dosya
 * @returns {Promise<string>} public URL
 */
export async function uploadFile(bucket, file) {
  const ext = file.name.split(".").pop();
  const safeExt = (ext || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  // Benzersiz dosya adı (Date.now + rastgele) — çakışmayı önler
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
