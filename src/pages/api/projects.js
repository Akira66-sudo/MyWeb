import { supabase } from "../../lib/supabaseClient";

export async function POST({ request }) {
  if (!supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "Database offline" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      category_name = "Web Application",
      description = "",
      tech_stack = [],
      demo_url = null,
      repo_url = null,
      image_url = null,
      is_featured = true,
      sort_order = 99
    } = body;

    if (!title) {
      return new Response(
        JSON.stringify({ success: false, error: "Judul proyek wajib diisi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Dapatkan atau Buat Kategori
    const slug = String(category_name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { data: catData } = await supabase
      .from("project_categories")
      .upsert({ name: category_name, slug: slug }, { onConflict: "name" })
      .select()
      .single();

    const categoryId = catData?.id || null;

    // 2. Insert Proyek
    const { data: project, error: projErr } = await supabase
      .from("projects")
      .insert({
        title,
        category_id: categoryId,
        description,
        image_url,
        demo_url,
        repo_url,
        is_featured,
        sort_order: Number(sort_order) || 99
      })
      .select()
      .single();

    if (projErr) {
      console.error("[Projects API] Create error:", projErr.message);
      return new Response(
        JSON.stringify({ success: false, error: projErr.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Hubungkan dengan Skills
    if (project && Array.isArray(tech_stack) && tech_stack.length > 0) {
      for (const tech of tech_stack) {
        if (!tech.trim()) continue;
        const { data: skillData } = await supabase
          .from("skills")
          .upsert({
            name: tech.trim(),
            category: "Frontend",
            icon_class: "ri-code-s-slash-line"
          }, { onConflict: "name" })
          .select()
          .single();

        if (skillData?.id) {
          await supabase
            .from("project_skills")
            .upsert({
              project_id: project.id,
              skill_id: skillData.id
            }, { onConflict: "project_id,skill_id" });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: project }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE({ url }) {
  const id = url.searchParams.get("id");
  if (!id || !supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "ID tidak valid / Database offline" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
