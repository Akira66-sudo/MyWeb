/**
 * Rute API: /api/keepalive
 * Endpoint ringan ini digunakan khusus oleh Cron Job (misalnya Vercel Cron) 
 * untuk membangunkan/mencegah Supabase dari mode "Auto-Sleep" karena tidak ada aktivitas.
 */
import { supabase } from "../../lib/supabaseClient";

// Memastikan fungsi ini dipanggil murni di server (SSR)
export const prerender = false;

export async function GET() {
  if (!supabase) {
    return new Response(JSON.stringify({ status: "Database offline atau tidak terkonfigurasi" }), { 
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  try {
    // Lakukan query seringan mungkin ke database.
    // Mengambil 1 baris ID saja sudah cukup untuk dihitung sebagai "Aktivitas" oleh Supabase.
    const { data, error } = await supabase.from('leaderboard').select('id').limit(1);
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ 
      status: "Supabase is Awake!", 
      timestamp: new Date().toISOString() 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "Error pinging database", message: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
