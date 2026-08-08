/**
 * Rute API: /api/score
 * Berfungsi untuk menerima skor dari game yang dimainkan pengguna (seperti TicTacToe/Snake)
 * dan menyimpannya ke Supabase Leaderboard.
 */
import { supabase } from "../../lib/supabaseClient";
import { isToxic } from "../../lib/ironDome.js";

// Endpoint ini berjalan murni di server (SSR)
export const prerender = false;

/**
 * Endpoint POST untuk menyimpan skor baru.
 */
export async function POST({ request }) {
  // Jika database offline/tidak dikonfigurasi, tolak permintaan
  if (!supabase) {
    return new Response(JSON.stringify({ success: false, error: "Database offline" }), {
      status: 503, // Service Unavailable
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { player_name, game_id, score } = body;

    // 1. Validasi Kolom: Nama, ID Game, dan Skor harus ada
    if (!player_name || !game_id || score === undefined) {
      return new Response(JSON.stringify({ success: false, error: "Data tidak lengkap" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Iron Dome: Saring nama pemain dari kata-kata tidak senonoh
    if (isToxic(player_name)) {
      return new Response(
        JSON.stringify({ success: false, error: "Terdeteksi nama yang tidak pantas." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Simpan ke Supabase (tabel 'leaderboard')
    const { error: dbError } = await supabase.from("leaderboard").insert([
      {
        player_name: player_name.toUpperCase(), // Ubah nama jadi kapital
        game_type: game_id,
        score
      }
    ]);

    if (dbError) throw new Error(dbError.message);

    // 4. Sukses menyimpan skor
    return new Response(JSON.stringify({ success: true, message: "Skor berhasil disimpan" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    // 5. Penanganan Error
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
