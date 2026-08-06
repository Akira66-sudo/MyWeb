import { DEV_CONFIG } from '../config/dev.config';
import { createClient } from '@supabase/supabase-js';

const localStats = { views: 0, likes: 0 };
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Inisialisasi Supabase (jika kredensial ada)
let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.error('[DB] Gagal inisialisasi Supabase:', e.message);
}
// Logger helper
function log(message) {
  if (DEV_CONFIG.DEBUG_LOG) {
    console.log(message);
  }
}

// Ambil Stats (Fallback ke lokal jika gagal)
export const getStats = async () => {
  // DEV MODE: Skip Supabase, langsung pakai lokal
  if (DEV_CONFIG.USE_LOCAL_STATS) {
    log('[DEV] Pakai stats lokal');
    return localStats;
  }

  if (!supabase) {
    log('[DB] Supabase tidak aktif, pakai data lokal.');
    return localStats;
  }

  try {
    const { data, error } = await supabase
      .from('page_stats')
      .select('views, likes')
      .eq('slug', 'home')
      .single();

    if (error) throw error;
    log('[PROD] Stats dari Supabase');
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal ambil stats: ${e.message}. Pakai data lokal.`);
    return localStats;
  }
};

// Tambah Views (Fallback: return lokal, tidak update)
export const incrementViews = async () => {
  // DEV MODE: Skip update, return lokal
  if (DEV_CONFIG.USE_LOCAL_STATS) {
    return localStats;
  }

  if (!supabase) return localStats;

  try {
    const current = await getStats();
    const { data, error } = await supabase
      .from('page_stats')
      .update({ views: current.views + 1 })
      .eq('slug', 'home')
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal update views: ${e.message}. Return lokal.`);
    return localStats;
  }
};

// Tambah Likes (Fallback: return lokal, tidak update)
export const incrementLikes = async () => {
  // DEV MODE: Skip update, return lokal
  if (DEV_CONFIG.USE_LOCAL_STATS) {
    return localStats;
  }

  if (!supabase) return localStats;

  try {
    const current = await getStats();
    const { data, error } = await supabase
      .from('page_stats')
      .update({ likes: current.likes + 1 })
      .eq('slug', 'home')
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal update likes: ${e.message}. Return lokal.`);
    return localStats;
  }
};
