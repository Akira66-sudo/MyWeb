/**
 * dataFetcher.js
 * Modul ini berfungsi sebagai lapisan pengambil data (Data Access Layer).
 * Data saat ini diambil dari file JSON statis lokal, namun antarmukanya
 * didesain asinkron (menggunakan async/await) agar mudah diganti jika kelak
 * beralih ke database eksternal.
 */

import siteData from "../data/siteData.json";
import projectsData from "../data/projects.json";
import skillsData from "../data/skills.json";
import workPhasesData from "../data/workPhases.json";
import socialsData from "../data/socials.json";

/**
 * Mengambil seluruh teks dan konfigurasi situs secara mentah.
 * @returns {Promise<Object>} Objek data situs mentah dari siteData.json.
 */
export async function getSiteTexts() {
  return siteData;
}

/**
 * Mengambil dan memformat data identitas serta statistik utama.
 * Memetakan struktur JSON baru ke format lama agar tidak merusak komponen yang sudah ada.
 *
 * @returns {Promise<Object>} Objek berisi { identity, stats } yang diformat.
 */
export async function getSiteData() {
  // Memetakan struktur baru ke struktur lama yang diekspektasikan komponen
  return {
    identity: {
      name: siteData.identity?.name || "Muhammad Raid Zaidani",
      nickname: siteData.identity?.nickname || "zidan-idz",
      role: siteData.identity?.role || "FULLSTACK DEVELOPER",
      location: siteData.identity?.location || "Lombok, Indonesia",
      status: siteData.identity?.status || "AVAILABLE FOR FREELANCE & FULL-TIME POSITIONS",
      bio: siteData.identity?.about_description || "",
      about_title: siteData.identity?.about_title || "Behind the Code",
      hero_headline: siteData.identity?.name || "Muhammad Raid Zaidani.",
      hero_bio: siteData.identity?.hero_subtitle || "",
      tech_description:
        siteData.identity?.tech_description ||
        "A high-performance architecture built with the best tools in the industry.",
      email: siteData.identity?.email || "contact@example.com",
      resume_url: siteData.identity?.resume_url || "#",
      footer_bio: siteData.identity?.footer_bio || ""
    },
    stats: {
      stat_1_label: "Years of Coding",
      stat_1_value: "3",
      stat_2_label: "Tech Stacks Mastered",
      stat_2_value: "10",
      stat_3_label: "Projects Developed",
      stat_3_value: "20",
      stat_4_label: "Infinite Curiosity",
      stat_4_value: "1"
    }
  };
}

/**
 * Mengambil data fase pekerjaan (work phases/pengalaman/pendidikan).
 * @returns {Promise<Array>} Array berisi objek riwayat pengalaman.
 */
export async function getWorkPhases() {
  return workPhasesData;
}

/**
 * Mengambil data keahlian (skills/tech stack) yang dikuasai.
 * @returns {Promise<Array>} Array berisi data skill.
 */
export async function getTechStacks() {
  return skillsData;
}

/**
 * Mengambil data tautan sosial media.
 * @returns {Promise<Array>} Array berisi objek tautan sosial media.
 */
export async function getSocialLinks() {
  return socialsData;
}

/**
 * Mengambil daftar proyek dari file JSON dan menstandarisasi propertinya.
 *
 * @returns {Promise<Array>} Array berisi daftar proyek yang telah diformat.
 */
export async function getProjects() {
  return projectsData.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    techStack: p.tags || p.techStack || [],
    link: p.github_url || p.repo_url,
    demo: p.demo_url || p.demo,
    image: p.image_url || p.image,
    isFeatured: p.is_featured || false
  }));
}
