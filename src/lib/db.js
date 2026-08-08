/**
 * db.js
 * Modul ini menangani koneksi dan operasi database dengan Supabase.
 * Dilengkapi dengan mekanisme 'fallback' agar situs tidak crash
 * jika database sedang offline atau dalam mode pengembangan.
 */

import { DEV_CONFIG } from "../config/dev.config";
import { createClient } from "@supabase/supabase-js";

/**
 * Data statistik bawaan yang digunakan jika gagal mengambil dari Supabase.
 * @type {{views: number, likes: number}}
 */
const localStats = { views: 0, likes: 0 };
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Inisialisasi Klien Supabase (jika variabel lingkungan tersedia)
let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.error("[DB] Gagal inisialisasi Supabase:", e.message);
}

/**
 * Mencetak log ke konsol secara kondisional (hanya jika diizinkan di mode DEV).
 * @param {string} message - Pesan log yang ingin dicetak.
 */
function log(message) {
  if (DEV_CONFIG.DEBUG_LOG) {
    console.log(message);
  }
}

/**
 * Mengambil statistik (views & likes) halaman utama.
 * Jika koneksi Supabase gagal atau dimatikan, akan mengembalikan data lokal.
 *
 * @returns {Promise<{views: number, likes: number}>} Data statistik terbaru.
 */
export const getStats = async () => {
  // Mode Pengembangan: Jangan sentuh Supabase, hemat kuota
  if (DEV_CONFIG.USE_LOCAL_STATS) {
    log("[DEV] Pakai stats lokal");
    return localStats;
  }

  if (!supabase) {
    log("[DB] Supabase tidak aktif, pakai data lokal.");
    return localStats;
  }

  try {
    const { data, error } = await supabase
      .from("page_stats")
      .select("views, likes")
      .eq("slug", "home")
      .single();

    if (error) throw error;
    log("[PROD] Stats dari Supabase berhasil ditarik");
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal ambil stats: ${e.message}. Pakai data lokal.`);
    return localStats;
  }
};

/**
 * Menambahkan jumlah kunjungan (views) sebesar 1.
 *
 * @returns {Promise<{views: number, likes: number}>} Data statistik yang sudah diperbarui.
 */
export const incrementViews = async () => {
  if (DEV_CONFIG.USE_LOCAL_STATS) {
    return localStats;
  }

  if (!supabase) return localStats;

  try {
    const current = await getStats();
    const { data, error } = await supabase
      .from("page_stats")
      .update({ views: current.views + 1 })
      .eq("slug", "home")
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal update views: ${e.message}. Return lokal.`);
    return localStats;
  }
};

/**
 * Menambahkan jumlah 'likes' sebesar 1 saat pengguna menekan tombol suka.
 *
 * @returns {Promise<{views: number, likes: number}>} Data statistik yang sudah diperbarui.
 */
export const incrementLikes = async () => {
  if (DEV_CONFIG.USE_LOCAL_STATS) {
    return localStats;
  }

  if (!supabase) return localStats;

  try {
    const current = await getStats();
    const { data, error } = await supabase
      .from("page_stats")
      .update({ likes: current.likes + 1 })
      .eq("slug", "home")
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal update likes: ${e.message}. Return lokal.`);
    return localStats;
  }
};
