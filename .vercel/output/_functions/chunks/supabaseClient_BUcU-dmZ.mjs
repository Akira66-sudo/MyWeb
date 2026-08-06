import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://emkdrleoagjxyhpyhflt.supabase.co";
const supabaseKey = "sb_publishable_vLSNWb-12yQVsXQRjoLtfg_dDCqQXM1";
const supabase = createClient(supabaseUrl, supabaseKey) ;
const getLeaderboardFromDB = async () => [];
async function getGameStatsFromDB() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("global_game_stats").select("*").limit(1).single();
  if (error && error.code !== "PGRST116") {
    console.error("[Supabase DB] Error fetching game stats:", error);
  }
  return data || null;
}

export { getLeaderboardFromDB as a, getGameStatsFromDB as g, supabase as s };
