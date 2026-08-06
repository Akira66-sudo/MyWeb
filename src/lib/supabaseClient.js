import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_KEY || import.meta.env.SUPABASE_KEY;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const getLeaderboardFromDB = async () => []; // Temporarily keep for game stats compatibility

export async function getGameStatsFromDB() {
  if (!supabase) return null;
  const { data, error } = await supabase.from('global_game_stats').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') {
    console.error('[Supabase DB] Error fetching game stats:', error);
  }
  return data || null;
}