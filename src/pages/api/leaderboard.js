export const prerender = false;
import { supabase, getLeaderboardFromDB } from "../../lib/supabaseClient";

export async function GET({ url }) {
  const gameType = url.searchParams.get("game") || "dino";
  
  if (!supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "Database offline", data: [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = await getLeaderboardFromDB(gameType, 10);
  return new Response(
    JSON.stringify({ success: true, data: data || [] }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST({ request }) {
  if (!supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "Database tidak terhubung" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { game_type, player_name, score } = body;

    if (!game_type || !score || isNaN(Number(score))) {
      return new Response(
        JSON.stringify({ success: false, error: "Data skor tidak valid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Bersihkan nama pemain (maks 5 karakter uppercase, alfanumerik)
    const cleanName = (String(player_name || "ANON"))
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 5) || "ANON";

    const { data, error } = await supabase
      .from("leaderboards")
      .insert({
        game_type: String(game_type),
        player_name: cleanName,
        score: Math.max(0, Math.floor(Number(score)))
      })
      .select()
      .single();

    if (error) {
      console.error("[Leaderboard API] Insert error:", error.message);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
