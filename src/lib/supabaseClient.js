/**
 * supabaseClient.js
 * Modul utama untuk menginisialisasi koneksi dengan Supabase.
 * File ini juga memuat beberapa fungsi pendukung untuk mengambil data
 * khusus mini-game.
 */

import { createClient } from "@supabase/supabase-js";

// Mencari URL dan Kunci (Key) dari berbagai kemungkinan penamaan variabel lingkungan (Environment Variables)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.PUBLIC_SUPABASE_KEY ||
  import.meta.env.SUPABASE_KEY;

/**
 * Instansiasi klien Supabase.
 * Jika URL atau Key tidak ditemukan (misalnya di mode build lokal tanpa .env), nilainya akan null.
 */
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Dummy function (fungsi tiruan) untuk menjaga kompatibilitas dengan komponen mini-game lama.
 * Saat ini mengembalikan array kosong agar tidak terjadi error (crash).
 * @returns {Promise<Array>} Array kosong
 */
export const getLeaderboardFromDB = async () => []; // Temporarily keep for game stats compatibility

/**
 * Mengambil data statistik global permainan (contoh: skor tertinggi keseluruhan).
 *
 * @returns {Promise<Object|null>} Data statistik permainan atau null jika gagal.
 */
export async function getGameStatsFromDB() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("global_game_stats").select("*").limit(1).single();
  if (error && error.code !== "PGRST116") {
    // Abaikan error PGRST116 (0 rows returned) karena wajar jika tabel kosong
    console.error("[Supabase DB] Error fetching game stats:", error);
  }
  return data || null;
}
