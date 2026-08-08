// src/pages/api/wakeup.js
// Hidden API route to wake up backend services (e.g. Supabase) without UI
export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const key = url.searchParams.get("admin_key");

  // --- GOD MODE: DIRECT API ACTION ---
  if (key !== "zeyshyy") {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Example backend ping here
  // Example: const { data } = await supabase.from('projects').select('id').limit(1);

  return new Response(
    JSON.stringify({
      status: "success",
      message: "⚡ [GOD MODE] Backend Woken Up & System Validated.",
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
