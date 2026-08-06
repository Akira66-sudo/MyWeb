# 🚀 RENCANA SELANJUTNYA: Evolusi CMS Dinamis & Global Leaderboard (Enterprise Relational Schema)

Dokumen ini adalah cetak biru (*blueprint*) arsitektur V3. Tujuannya mengubah portofolio statis ini menjadi sistem **Fullstack CMS (Content Management System) & Arena Interaktif** berbasis Supabase PostgreSQL dengan standar *Enterprise Relational Database* (Normalisasi 3NF, Foreign Keys, ENUM, dan Indexing).

80% teks di website, proyek, pengaturan profil, hingga skor mini-game akan tersimpan di database dan bisa dikendalikan sepenuhnya dari Dasbor Admin tanpa menyentuh kode.

---

## 🏗️ 1. Arsitektur Sistem
- **Frontend / Meta-Framework:** Astro (mode Server-Side Rendering / SSR).
- **Hosting:** Vercel (Free Tier).
- **Backend / Database:** Supabase (PostgreSQL - Free Tier).
- **Autentikasi:** Supabase Auth.
- **Penyimpanan File:** Supabase Storage (Gambar & Aset).

---

## 🗄️ 2. Skema Database Relasional (PostgreSQL) - The Ultimate Relational Schema

Kita menerapkan prinsip **Relational Integrity** menggunakan **Foreign Keys (FK)** dan **ENUM** agar struktur data tidak ambigu, tidak duplikat, dan saling terhubung.

### A. Tipe Data Enumerasi (ENUM)
- `skill_category_enum`: Membatasi kategori teknologi hanya pada `('Frontend', 'Backend', 'Game Dev', 'Tools & DevOps')`.
- `game_type_enum`: Membatasi jenis game di leaderboard hanya pada `('dino', 'memory', 'tic_tac_toe')`.

### B. Tabel Master & Relasi (Hanya Admin yang bisa Edit)
1. **`project_categories` (Tabel Master Kategori)**
   - `id`, `name`, `slug`, `sort_order`.
2. **`skills` (Tabel Master Tech Stack)**
   - `id`, `name`, `category` (ENUM), `icon_class`, `sort_order`.
3. **`projects` (Tabel Utama Proyek)**
   - `id`, `title`, `category_id` (FK ke `project_categories.id`), `description`, `image_url`, `demo_url`, `repo_url`, `is_featured`, `sort_order`.
4. **`project_skills` (Tabel Relasi Many-to-Many)**
   - `project_id` (FK ke `projects.id`), `skill_id` (FK ke `skills.id`).
   - *Menghubungkan proyek dengan teknologi yang dipakai secara relasional (bukan sekadar array teks).*
5. **`site_content` (Pengaturan Teks & Profil)**
   - *Tabel 1 baris untuk mengatur teks statis di seluruh web.*
   - `hero_headline`, `about_description`, `email`, `github_url`, `linkedin_url`, `stats_experience_years`, `stats_lines_of_code`, `stats_coffee_cups`.

### C. Tabel Arena Interaktif (Publik bisa Insert Skor)
6. **`global_game_stats` (Statistik Global Tic-Tac-Toe)**
   - `human_wins`, `ai_wins`, `draws`.
7. **`leaderboards` (Papan Peringkat Global)**
   - `id`, `game_type` (ENUM), `player_name` (VARCHAR 5), `score`, `created_at`.

---

## 🛡️ 3. Keamanan Tingkat Baris (Row Level Security / RLS)
- **Tabel Konten & Relasi (1 - 5):** Publik hanya bisa *SELECT* (Baca). Admin (*Authenticated*) bisa *INSERT, UPDATE, DELETE*.
- **Tabel Game (6 - 7):** Publik bisa *SELECT* (Baca) dan *INSERT/UPDATE* (Nulis Skor). Publik **TIDAK BISA** menghapus skor orang lain.

---

## ⚡ 4. Skrip Eksekusi Database (Tinggal *Run* di Supabase)
Saat Supabase sudah dibuat, tempel kode SQL di bawah ini ke dalam **SQL Editor** Supabase. Skrip ini akan membuat ENUM, Tabel, Foreign Keys, Indexes, serta kebijakan RLS sekaligus:

```sql
-- ==========================================
-- 0. BUAT ENUM TYPES (Tipe Data Terproteksi)
-- ==========================================
CREATE TYPE skill_category_enum AS ENUM ('Frontend', 'Backend', 'Game Dev', 'Tools & DevOps');
CREATE TYPE game_type_enum AS ENUM ('dino', 'memory', 'tic_tac_toe');

-- ==========================================
-- 1. TABEL MASTER (KATEGORI & SKILLS)
-- ==========================================
CREATE TABLE project_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category skill_category_enum NOT NULL DEFAULT 'Frontend',
  icon_class TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ==========================================
-- 2. TABEL UTAMA (PROJECTS & RELASINYA)
-- ==========================================
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  demo_url TEXT,
  repo_url TEXT,
  is_featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tabel Relasi Many-to-Many (Project <-> Skill)
-- Menghubungkan proyek dengan skill secara relasional dan bersih
CREATE TABLE project_skills (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- ==========================================
-- 3. TABEL KONTEN DAN STATISTIK WEB
-- ==========================================
CREATE TABLE site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT DEFAULT 'Muhammad Raid Zaidani',
  nickname TEXT DEFAULT 'zidan-idz',
  role TEXT DEFAULT 'Fullstack Developer',
  location TEXT DEFAULT 'Lombok, Indonesia',
  status TEXT DEFAULT 'Available for projects',
  hero_headline TEXT DEFAULT 'Behind the Code',
  about_description TEXT,
  email TEXT,
  github_url TEXT,
  facebook_url TEXT,
  telegram_url TEXT,
  instagram_url TEXT,
  blog_url TEXT,
  linkedin_url TEXT,
  stats_experience_years INTEGER DEFAULT 0,
  stats_lines_of_code INTEGER DEFAULT 0,
  stats_coffee_cups INTEGER DEFAULT 0
);

-- Tabel untuk menyimpan seluruh teks antarmuka dan tombol di web
CREATE TABLE site_texts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ==========================================
-- 4. TABEL ARENA INTERAKTIF (GAME STATS & LEADERBOARDS)
-- ==========================================
CREATE TABLE global_game_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  human_wins INTEGER DEFAULT 0,
  ai_wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0
);

CREATE TABLE leaderboards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_type game_type_enum NOT NULL, -- Dibatasi ketat oleh ENUM
  player_name VARCHAR(5) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan pengamanan tingkat baris (RLS)
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_texts ENABLE ROW LEVEL SECURITY;

-- KONTEN WEB: Publik Baca | Admin Kelola
CREATE POLICY "Publik BACA Categories" ON project_categories FOR SELECT USING (true);
CREATE POLICY "Publik BACA Skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Publik BACA Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Publik BACA ProjectSkills" ON project_skills FOR SELECT USING (true);
CREATE POLICY "Publik BACA SiteContent" ON site_content FOR SELECT USING (true);
CREATE POLICY "Publik BACA SiteTexts" ON site_texts FOR SELECT USING (true);

CREATE POLICY "Admin KELOLA Categories" ON project_categories TO authenticated USING (true);
CREATE POLICY "Admin KELOLA Skills" ON skills TO authenticated USING (true);
CREATE POLICY "Admin KELOLA Projects" ON projects TO authenticated USING (true);
CREATE POLICY "Admin KELOLA ProjectSkills" ON project_skills TO authenticated USING (true);
CREATE POLICY "Admin KELOLA SiteContent" ON site_content TO authenticated USING (true);
CREATE POLICY "Public INSERT/UPDATE SiteTexts" ON site_texts FOR ALL USING (true) WITH CHECK (true);

-- ARENA INTERAKTIF: Publik Baca & Tulis
CREATE POLICY "Publik BACA Leaderboard" ON leaderboards FOR SELECT USING (true);
CREATE POLICY "Publik INSERT Leaderboard" ON leaderboards FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin KELOLA Leaderboard" ON leaderboards TO authenticated USING (true);

CREATE POLICY "Publik BACA Game Stats" ON global_game_stats FOR SELECT USING (true);
CREATE POLICY "Publik UPDATE Game Stats" ON global_game_stats FOR UPDATE USING (true);
```

---

## 🚀 Langkah Eksekusi (Tugas Pengguna):
1. Buat akun & proyek di [Supabase.com](https://supabase.com).
2. Dapatkan `Project URL` dan `anon key`.
3. Simpan di file `.env` di komputer lokal:
   ```env
   SUPABASE_URL=url_anda
   SUPABASE_ANON_KEY=key_anda
   ```
4. *Copy-Paste* skrip SQL di atas ke menu SQL Editor Supabase.
5. Buat sebuah *Bucket* di Supabase Storage bernama `portfolio-assets` dan atur ke mode *Public*.
