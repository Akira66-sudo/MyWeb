// Development Configuration
export const DEV_CONFIG = {
    // Data Fetching Mode (siteData & projects)
    // true  = Skip online, langsung pakai data lokal
    // false = Coba online dulu, fallback ke lokal jika gagal
    USE_LOCAL_DATA: true,

    // Stats/Supabase Mode
    // true  = Skip Supabase, langsung pakai stats.json lokal
    // false = Pakai Supabase (fallback ke lokal jika gagal)
    USE_LOCAL_STATS: false,

    // Loader Mode
    // true  = Selalu tampilkan loader (abaikan cooldown)
    // false = Tampilkan sesuai cooldown (10 menit)
    LOADER_ALWAYS_SHOW: false,

    // Enable debug logging ke console
    DEBUG_LOG: false
};
