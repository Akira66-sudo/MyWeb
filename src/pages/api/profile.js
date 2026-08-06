import { supabase } from "../../lib/supabaseClient";

export async function GET() {
  if (!supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "Database offline" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value");

    if (error) {
      throw new Error(error.message);
    }

    const contentObj = {};
    data?.forEach(row => {
      contentObj[row.key] = row.value;
    });

    return new Response(
      JSON.stringify({ success: true, data: contentObj }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST({ request }) {
  if (!supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "Database offline" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    
    // Convert form keys to DB column names if necessary
    // 'hero_headline' is mapped to 'hero_headline' in DB (if it exists)
    // We will update row id = 1
    const { error } = await supabase
      .from("site_content")
      .update({
        name: body.name,
        nickname: body.nickname,
        role: body.role,
        location: body.location,
        email: body.email,
        hero_headline: body.hero_headline,
        about_description: body.about_description,
        stat_1_label: body.stat_1_label,
        stat_1_value: body.stat_1_value,
        stat_2_label: body.stat_2_label,
        stat_2_value: body.stat_2_value,
        stat_3_label: body.stat_3_label,
        stat_3_value: body.stat_3_value,
        stat_4_label: body.stat_4_label,
        stat_4_value: body.stat_4_value
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profil dan konten website berhasil disimpan ke database (KV store)!"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
