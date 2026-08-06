import { s as supabase } from '../../chunks/supabaseClient_BUcU-dmZ.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;

async function GET() {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
