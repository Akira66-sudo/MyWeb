import { supabase } from "../../lib/supabaseClient";

const projectsLocal = [];
const siteDataLocal = { identity: {} };
export async function GET() {
  if (!supabase) {
    return new Response(
      JSON.stringify({ success: false, error: "Supabase client belum terinisialisasi. Periksa file .env Anda." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const results = {
      categories: 0,
      skills: 0,
      projects: 0,
      site_content: false,
      game_stats: false
    };

    // 1. Seed Project Categories
    const categoriesSet = new Set(projectsLocal.map(p => p.category || "Web Application"));
    const categoryMap = {}; // name -> uuid

    for (const catName of categoriesSet) {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      // Upsert kategori
      const { data, error } = await supabase
        .from("project_categories")
        .upsert({ name: catName, slug: slug }, { onConflict: "name" })
        .select()
        .single();

      if (data) {
        categoryMap[catName] = data.id;
        results.categories++;
      } else if (error) {
        throw new Error(`Gagal menyimpan kategori "${catName}": ${error.message}`);
      }
    }

    // 2. Seed Skills (Tech Stack)
    const skillsSet = new Set();
    projectsLocal.forEach(p => {
      (p.techStack || []).forEach(tech => skillsSet.add(tech));
    });

    const skillMap = {}; // name -> uuid
    for (const skillName of skillsSet) {
      // Upsert skill
      const { data, error } = await supabase
        .from("skills")
        .upsert({
          name: skillName,
          category: "Frontend", // Default enum category
          icon_class: "ri-code-s-slash-line"
        }, { onConflict: "name" })
        .select()
        .single();

      if (data) {
        skillMap[skillName] = data.id;
        results.skills++;
      } else if (error) {
        throw new Error(`Gagal menyimpan skill "${skillName}": ${error.message}`);
      }
    }

    // 3. Seed Projects & Project_Skills
    for (let i = 0; i < projectsLocal.length; i++) {
      const p = projectsLocal[i];
      const catId = categoryMap[p.category || "Web Application"] || null;

      // Cek apakah proyek dengan judul ini sudah ada
      let { data: existing } = await supabase
        .from("projects")
        .select("id")
        .eq("title", p.title)
        .maybeSingle();

      let projectId = existing?.id;

      if (!projectId) {
        const { data: newProj, error: projErr } = await supabase
          .from("projects")
          .insert({
            title: p.title,
            category_id: catId,
            description: p.description || "",
            demo_url: p.demo || null,
            repo_url: p.link || null,
            is_featured: true,
            sort_order: i + 1
          })
          .select()
          .single();

        if (projErr) {
          throw new Error(`Gagal menyimpan proyek "${p.title}": ${projErr.message}`);
        }
        projectId = newProj.id;
        results.projects++;
      }

      // Insert ke project_skills
      if (projectId && p.techStack && p.techStack.length > 0) {
        for (const tech of p.techStack) {
          const skillId = skillMap[tech];
          if (skillId) {
            await supabase
              .from("project_skills")
              .upsert({ project_id: projectId, skill_id: skillId }, { onConflict: "project_id,skill_id" });
          }
        }
      }
    }

    // 4. Seed Site Content
    const identity = siteDataLocal.identity || {};
    const { data: contentData } = await supabase
      .from("site_content")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (!contentData) {
      await supabase
        .from("site_content")
        .insert({
          name: identity.name || "Muhammad Raid Zaidani",
          nickname: identity.nickname || "zidan-idz",
          role: identity.role || "Fullstack Developer",
          location: identity.location || "Lombok, Indonesia",
          status: identity.status || "Available for projects",
          hero_headline: "Behind the Code",
          about_description: identity.bio || "",
          email: identity.email || "",
          github_url: identity.github || "",
          facebook_url: identity.facebook || "",
          telegram_url: identity.telegram || "",
          instagram_url: identity.instagram || "",
          blog_url: identity.blog || "",
          linkedin_url: "",
          stats_experience_years: 3,
          stats_lines_of_code: 500000,
          stats_coffee_cups: 1200
        });
      results.site_content = true;
    } else {
      await supabase
        .from("site_content")
        .update({
          name: identity.name || "Muhammad Raid Zaidani",
          nickname: identity.nickname || "zidan-idz",
          role: identity.role || "Fullstack Developer",
          location: identity.location || "Lombok, Indonesia",
          status: identity.status || "Available for projects",
          facebook_url: identity.facebook || "",
          telegram_url: identity.telegram || "",
          instagram_url: identity.instagram || "",
          blog_url: identity.blog || ""
        })
        .eq("id", contentData.id);
      results.site_content = true;
    }

    // 5. Seed Global Game Stats
    const { data: gameData } = await supabase
      .from("global_game_stats")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (!gameData) {
      await supabase
        .from("global_game_stats")
        .insert({ human_wins: 0, ai_wins: 0, draws: 0 });
      results.game_stats = true;
    }

    // 6. Seed Site Texts (Semua Teks Tombol & Judul Bagian Web)
    const initialSiteTexts = [
      // Section: Hero
      { section: "Hero", key: "hero.badge", label: "Badge Atas Hero", content: "FULLSTACK DEVELOPER", sort_order: 1 },
      { section: "Hero", key: "hero.title", label: "Judul Utama Hero (Nama)", content: "Muhammad Raid Zaidani.", sort_order: 2 },
      { section: "Hero", key: "hero.subtitle", label: "Deskripsi Singkat Hero", content: "Building useful web applications with clean architecture, thoughtful user experience, and scalable backend systems. Passionate about turning ideas into software that people actually use.", sort_order: 3 },
      { section: "Hero", key: "hero.btn_primary", label: "Teks Tombol Kiri Hero", content: "VIEW MY WORK ↘", sort_order: 4 },
      { section: "Hero", key: "hero.btn_secondary", label: "Teks Tombol Kanan Hero", content: "INITIATE CONTACT", sort_order: 5 },

      // Section: About
      { section: "About", key: "about.tag", label: "Label Judul Kecil About", content: "Know Me Better / 01", sort_order: 10 },
      { section: "About", key: "about.title", label: "Judul Utama About", content: "Behind the Code", sort_order: 11 },
      { section: "About", key: "about.intro", label: "Deskripsi Intro About", content: "Specialized in engineering full-scale digital solutions, from modern web applications to interactive games using performance-driven architectures. A Fullstack Developer from Lombok, Indonesia, committed to professional-grade programming.", sort_order: 12 },
      { section: "About", key: "about.phase_1_title", label: "Judul Phase 01", content: "Discovery & Architecture", sort_order: 13 },
      { section: "About", key: "about.phase_1_desc", label: "Deskripsi Phase 01", content: "My journey started with a deep curiosity about digital systems, evolving into building full-stack web applications and interactive games. I focus on designing scalable architectures that bridge clean logic with real-world functionality.", sort_order: 14 },
      { section: "About", key: "about.phase_2_title", label: "Judul Phase 02", content: "Craft & Execution", sort_order: 15 },
      { section: "About", key: "about.phase_2_desc", label: "Deskripsi Phase 02", content: "On the technical side, I work seamlessly across modern web frameworks, Python backends, and game engines like Godot. As a Fullstack Developer, my goal is to engineer high-quality digital products that set new standards.", sort_order: 16 },

      // Section: Tech Stack
      { section: "TechStack", key: "tech.tag", label: "Label Judul Kecil Tech Stack", content: "Technical Arsenal / 02", sort_order: 20 },
      { section: "TechStack", key: "tech.title", label: "Judul Utama Tech Stack", content: "Engineering Stack.", sort_order: 21 },
      { section: "TechStack", key: "tech.subtitle", label: "Deskripsi Tech Stack", content: "Curated tools, languages, and frameworks selected for building high-performance web applications and interactive games.", sort_order: 22 },

      // Section: Projects
      { section: "Projects", key: "projects.tag", label: "Label Judul Kecil Projects", content: "Selected Works / 03", sort_order: 30 },
      { section: "Projects", key: "projects.title", label: "Judul Utama Projects", content: "Featured Projects.", sort_order: 31 },
      { section: "Projects", key: "projects.subtitle", label: "Deskripsi Projects", content: "A selection of fullstack applications, interactive experiences, and production systems engineered for real-world utility.", sort_order: 32 },
      { section: "Projects", key: "projects.btn_all", label: "Teks Tombol Lihat Semua Karya", content: "EXPLORE ALL PROJECTS", sort_order: 33 },

      // Section: CTA Banner
      { section: "CtaBanner", key: "cta.tag", label: "Label Judul Kecil CTA Banner", content: "Collaboration / 04", sort_order: 40 },
      { section: "CtaBanner", key: "cta.title", label: "Judul CTA Banner", content: "Have an ambitious project or product idea?", sort_order: 41 },
      { section: "CtaBanner", key: "cta.subtitle", label: "Deskripsi CTA Banner", content: "Let's combine clean fullstack engineering with refined aesthetics to build something extraordinary.", sort_order: 42 },
      { section: "CtaBanner", key: "cta.btn_text", label: "Teks Tombol CTA Banner", content: "START A CONVERSATION", sort_order: 43 },

      // Section: Mini Games
      { section: "MiniGames", key: "games.tag", label: "Label Judul Kecil Mini Games", content: "Interactive Arcade / 05", sort_order: 50 },
      { section: "MiniGames", key: "games.title", label: "Judul Mini Games", content: "Developer Playground.", sort_order: 51 },
      { section: "MiniGames", key: "games.subtitle", label: "Deskripsi Mini Games", content: "Take a break from exploring code and test your skills in this custom-built interactive arcade.", sort_order: 52 },

      // Section: Contact
      { section: "Contact", key: "contact.tag", label: "Label Judul Kecil Contact", content: "Initiate Contact / 06", sort_order: 60 },
      { section: "Contact", key: "contact.title", label: "Judul Contact", content: "Let's Build Something.", sort_order: 61 },
      { section: "Contact", key: "contact.subtitle", label: "Deskripsi Contact", content: "Open for freelance projects, technical consulting, and full-time fullstack engineering opportunities. Send a message to start a conversation.", sort_order: 62 },
      { section: "Contact", key: "contact.btn_submit", label: "Teks Tombol Kirim Pesan Contact", content: "SEND MESSAGE", sort_order: 63 },

      // Section: Footer
      { section: "Footer", key: "footer.copyright", label: "Teks Copyright Footer", content: "© 2026 Muhammad Raid Zaidani. Crafted with clean architecture.", sort_order: 70 },
      { section: "Footer", key: "footer.tagline", label: "Teks Tagline Footer", content: "BEHIND THE CODE // FULLSTACK ENGINEER", sort_order: 71 }
    ];

    for (const item of initialSiteTexts) {
      await supabase
        .from("site_texts")
        .upsert(item, { onConflict: "key" });
    }
    results.site_texts = true;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Seeding data lokal ke Supabase PostgreSQL berhasil!",
        results
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
