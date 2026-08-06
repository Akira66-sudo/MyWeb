export const prerender = false;
import { supabase, getGameStatsFromDB } from "../../lib/supabaseClient";

export async function GET() {
  const stats = await getGameStatsFromDB();
  return new Response(
    JSON.stringify({
      success: true,
      data: stats || { human_wins: 0, ai_wins: 0, draws: 0 }
    }),
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
    const { result } = body; // 'human', 'ai', atau 'draw'

    if (!["human", "ai", "draw"].includes(result)) {
      return new Response(
        JSON.stringify({ success: false, error: "Tipe hasil tidak valid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const current = await getGameStatsFromDB();
    const id = current?.id;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Row statistik game belum di-seed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const colName = result === "human" ? "human_wins" : (result === "ai" ? "ai_wins" : "draws");
    const updatedValue = (current[colName] || 0) + 1;

    const { data, error } = await supabase
      .from("global_game_stats")
      .update({ [colName]: updatedValue })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Game Stats API] Update error:", error.message);
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
