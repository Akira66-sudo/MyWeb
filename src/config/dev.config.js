/**
 * dev.config.js
 * Pusat konfigurasi global untuk mempermudah proses pengembangan (Development).
 * Mengontrol apakah aplikasi harus menggunakan data lokal, mengabaikan Supabase,
 * atau menampilkan log debugging.
 */

export const DEV_CONFIG = {
  /**
   * Mode Pengambilan Data (siteData & projects)
   * true  = Abaikan koneksi online, langsung pakai file JSON lokal
   * false = Coba online dulu, fallback ke lokal jika gagal (saat ini tidak dipakai karena struktur SSG)
   */
  USE_LOCAL_DATA: true,

  /**
   * Mode Supabase (Statistik & Minigames)
   * true  = Abaikan Supabase, gunakan variabel memori lokal (views & likes tidak tersimpan permanen)
   * false = Hubungkan ke Supabase (akan fallback ke lokal otomatis jika koneksi gagal)
   */
  USE_LOCAL_STATS: false,

  /**
   * Mode Animasi Pemuat (Loader)
   * true  = Selalu tampilkan animasi loading (mengabaikan cooldown)
   * false = Tampilkan animasi sesuai cooldown (default: 10 menit per kunjungan)
   */
  LOADER_ALWAYS_SHOW: false,

  /**
   * Mode Log Debugging
   * true  = Cetak semua proses (seperti pemanggilan API dan status DB) ke console browser
   * false = Sembunyikan log agar konsol bersih di production
   */
  DEBUG_LOG: false
};
