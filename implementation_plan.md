# Rencana Desain Ulang Skema Database (WIP - REVISED v2)

Sesuai dengan diskusi kita:
- **Button Text:** Di-hardcode (dihapus dari rencana database).
- **Social Links:** Dibuatkan tabel khusus agar Anda bebas menambah/mengurangi platform sesuka hati.
- **Core Content (Bio, Nama, Project, Skill, Angka):** Dinamis (masuk database).
- **Struktural Label (Kop Surat/Judul Section):** Di-hardcode.

## 📝 Pemetaan UI ke Database (Versi Paling Final & Logis)

### 1. Tabel Utama: `site_content` (Single Row / Konfigurasi)
Menyimpan jati diri, bio panjang, dan statistik angka.
**Saran Arsitektur:** Karena tabel ini HANYA BOLEH memiliki 1 baris data, di SQL nanti kita akan pasang *constraint* `CHECK (id = 1)` agar tidak terjadi error duplikasi baris.

| Data / Fungsi UI | Rencana Kolom / Tipe Data |
| :--- | :--- |
| **Hero - Role Badge** | `role` (TEXT) |
| **Hero - Nama Utama** | `name` (TEXT) |
| **Hero - Subtitle / Bio** | `hero_bio` (TEXT) |
| **Stats - Angka Coding** | `stats_experience_years` (INT) |
| **Stats - Angka Lines** | `stats_lines_of_code` (INT) |
| **Stats - Angka Cups** | `stats_coffee_cups` (INT) |
| **About - Deskripsi** | `about_description` (TEXT) |
| **Tech Matrix - Deskripsi**| `tech_description` (TEXT) |
| **Footer - Bio Pendek** | `footer_bio` (TEXT) |
| **Kontak Email Utama** | `email` (TEXT) |
| **Tombol Download CV** | `resume_url` (TEXT) - *Baru ditambahkan* |

### 2. Tabel `work_phases` (Section 3: About)
- `title` (TEXT)
- `description` (TEXT)
- `order_index` (INT) - *Untuk sorting*

### 3. Tabel `tech_stacks` (Section 4 & 5)
- `name` (TEXT)
- `category` (TEXT)
- `icon_svg` (TEXT)
- `order_index` (INT)

### 4. Tabel `projects` (Section 6: Featured Projects)
- `title` (TEXT), `type` (TEXT), `description` (TEXT), `image_url` (TEXT), `repo_url` (TEXT), `demo_url` (TEXT)
- `tech_stack` (JSONB / TEXT[]) - **Saran Arsitektur:** Disimpan sebagai tipe data *Array/JSONB* `["Django", "Python"]` agar tidak repot *parsing* string pakai koma di Astro.
- `is_featured` (BOOLEAN)
- `order_index` (INT)

### 5. Tabel `social_links` (Section 9: Footer)
- `platform_name` (TEXT)
- `url` (TEXT)
- `icon_cdn_url` (TEXT)
- `is_active` (BOOLEAN) - **Saran Arsitektur:** Tambahan agar bisa sembunyikan sosmed tanpa menghapus data.
- `order_index` (INT)

### 6. Tabel `arcade_scores` (Section 8)
**Saran Arsitektur:** Jangan jadikan `score_value` saja, karena Tic-Tac-Toe butuh 2 skor (Human & AI). Struktur terbaiknya adalah *Key-Value*:
- `game` (TEXT) - Misal: "dino", "memory", "tictactoe_human", "tictactoe_ai"
- `score` (INT) - Angkanya.

---

### 🛡️ 7. Autentikasi & Keamanan (Supabase Auth & RLS)
Karena Anda menggunakan Supabase, saran paling blak-blakan dari saya terkait Autentikasi: **JANGAN MEMBUAT TABEL `users` ATAU `admin` MANUAL DI SKEMA PUBLIC!**

**Kenapa?**
Supabase sudah memiliki skema super aman bernama `auth.users`. Mengabaikannya dan membuat sistem login manual dengan tabel `public.users` adalah langkah mundur ke tahun 2010 dan sangat rawan dibobol.

**Rencana Eksekusi Autentikasi kita:**
1. **Login System:** Kita akan menggunakan bawaan Supabase Auth (Email & Password). Anda akan mendaftar (Sign Up) satu kali saja, lalu kita kunci fitur pendaftarannya agar orang asing tidak bisa ikut mendaftar.
2. **Row Level Security (RLS) Policy:** Kita tidak akan men-disable RLS secara membabi buta. Kita akan pasang aturan elegan seperti ini di setiap tabel:
   - **Aturan Publik (Website Pengunjung):** `SELECT` saja. Siapapun boleh melihat portfolio Anda.
   - **Aturan Admin (Panel Dashboard):** `INSERT`, `UPDATE`, `DELETE` HANYA diizinkan jika `auth.uid() IS NOT NULL` (Artinya, hanya Anda yang sedang login yang bisa mengedit).

Dengan arsitektur ini, bahkan jika *anon_key* Anda tersebar, hacker tidak akan bisa mengacak-acak database Anda karena mereka tidak punya token login Anda.

---

### ⚡ 8. Strategi Pengambilan Data (Performa Astro)
**Kritik Arsitektur:** Halaman depan website Anda membutuhkan data dari banyak tabel berbeda (`site_content`, `projects`, `tech_stacks`, dll). Kalau Astro mengeksekusi *query* Supabase secara terpisah (*waterfall*), performa web (*loading*) akan sedikit terganggu dan menghabiskan kuota *request* Supabase Anda.
**Solusi:** Nanti di SQL, kita akan membuat sebuah fungsi **RPC (Remote Procedure Call)** atau **View** yang akan menggabungkan semua tabel ini menjadi satu *response* JSON besar. Hasilnya: Astro hanya perlu melakukan **1 kali request** ke Supabase, dan website Anda akan memuat secepat kilat!

---
*Status: Perencanaan Selesai & Sempurna. Menunggu instruksi akhir untuk memulai eksekusi.*
