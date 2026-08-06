-- ==========================================
-- BATCH 1: DATABASE RESET & SCHEMA CREATION
-- ==========================================

-- 1. HAPUS TABEL LAMA (JIKA ADA)
DROP TABLE IF EXISTS public.arcade_scores CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.tech_stacks CASCADE;
DROP TABLE IF EXISTS public.work_phases CASCADE;
DROP TABLE IF EXISTS public.site_content CASCADE;
DROP TABLE IF EXISTS public.site_texts CASCADE;

-- 2. BUAT TABEL BARU

-- Tabel Utama (Single Row)
CREATE TABLE public.site_content (
    id INT PRIMARY KEY CHECK (id = 1), -- Memaksa hanya ada 1 baris
    role TEXT,
    name TEXT,
    hero_bio TEXT,
    stats_experience_years INT,
    stats_lines_of_code INT,
    stats_coffee_cups INT,
    about_description TEXT,
    tech_description TEXT,
    footer_bio TEXT,
    email TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Work Phases (Section 3)
CREATE TABLE public.work_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Tech Stacks (Section 4 & 5)
CREATE TABLE public.tech_stacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_svg TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Projects (Section 6)
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    repo_url TEXT,
    demo_url TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb, -- Array/JSON untuk skill
    is_featured BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Social Links (Section 9)
CREATE TABLE public.social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_cdn_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Arcade Scores (Section 8)
CREATE TABLE public.arcade_scores (
    game TEXT PRIMARY KEY,
    score INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FUNGSI RPC UNTUK ASTRO (Mencegah N+1 Query)
CREATE OR REPLACE FUNCTION get_portfolio_data()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'site_content', (SELECT row_to_json(sc) FROM public.site_content sc WHERE id = 1),
        'work_phases', (SELECT coalesce(json_agg(wp ORDER BY order_index ASC), '[]'::json) FROM public.work_phases wp),
        'tech_stacks', (SELECT coalesce(json_agg(ts ORDER BY category ASC, order_index ASC), '[]'::json) FROM public.tech_stacks ts),
        'projects', (SELECT coalesce(json_agg(p ORDER BY order_index ASC), '[]'::json) FROM public.projects p WHERE is_featured = true),
        'social_links', (SELECT coalesce(json_agg(sl ORDER BY order_index ASC), '[]'::json) FROM public.social_links sl WHERE is_active = true),
        'arcade_scores', (SELECT coalesce(json_object_agg(game, score), '{}'::json) FROM public.arcade_scores)
    ) INTO result;

    RETURN result;
END;
$$;

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arcade_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public read access work_phases" ON public.work_phases FOR SELECT USING (true);
CREATE POLICY "Public read access tech_stacks" ON public.tech_stacks FOR SELECT USING (true);
CREATE POLICY "Public read access projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read access social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public read access arcade_scores" ON public.arcade_scores FOR SELECT USING (true);

CREATE POLICY "Admin all access site_content" ON public.site_content FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin all access work_phases" ON public.work_phases FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin all access tech_stacks" ON public.tech_stacks FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin all access projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin all access social_links" ON public.social_links FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin all access arcade_scores" ON public.arcade_scores FOR ALL USING (auth.uid() IS NOT NULL);

-- ==========================================
-- BATCH 2: DUMMY DATA INJECTION
-- ==========================================

INSERT INTO public.site_content (id, role, name, hero_bio, stats_experience_years, stats_lines_of_code, stats_coffee_cups, about_description, tech_description, footer_bio, email, resume_url)
VALUES (
    1, 
    'FULLSTACK DEVELOPER', 
    'Muhammad Raid Zaidani', 
    'Building useful web applications with clean architecture, thoughtful user experience, and scalable backend systems. Passionate about turning ideas into software that people actually use.',
    4, 
    100000, 
    500,
    'Specialized in engineering full-scale digital solutions from database architecture to frontend interactions. I bridge the gap between complex logic and seamless user experience.',
    'A high-performance architecture built with the best tools. Designed for scalability, security, and speed across all layers of the stack.',
    'Fullstack Developer & Game Creator engineering web solutions, Python systems, and interactive experiences with precision.',
    'm.raid.zaidani@gmail.com',
    '#'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.work_phases (title, description, order_index) VALUES 
('DISCOVERY & ARCHITECTURE', 'My journey started with a deep curiosity...', 1),
('CRAFT & EXECUTION', 'On the technical side, I work seamlessly across...', 2);

INSERT INTO public.tech_stacks (name, category, order_index) VALUES 
('HTML5 & CSS3', 'FRONTEND', 1),
('JavaScript (ES6+)', 'FRONTEND', 2),
('Astro', 'FRONTEND', 3),
('Python', 'BACKEND', 1),
('Django', 'BACKEND', 2),
('PostgreSQL', 'DATABASE', 1),
('Godot Engine', 'GAME DEV & TOOLS', 1);

INSERT INTO public.arcade_scores (game, score) VALUES 
('dino', 500),
('memory', 12),
('tictactoe_human', 10),
('tictactoe_ai', 1);
