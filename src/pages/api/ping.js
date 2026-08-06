export const prerender = false;
import { supabase } from "../../lib/supabaseClient";

export async function GET() {
  if (!supabase) {
    return new Response(JSON.stringify({ success: false, message: "No DB" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Simple ping to keep DB alive
    const { data, error } = await supabase.from('page_stats').select('views').limit(1);
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, message: "Pong" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
