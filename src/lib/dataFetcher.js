import siteData from "../data/siteData.json";
import projectsData from "../data/projects.json";
import skillsData from "../data/skills.json";
import workPhasesData from "../data/workPhases.json";
import socialsData from "../data/socials.json";

// ----------------------------------------------------
// FUNGSI LEGACY (Diubah untuk membaca JSON lokal SSG)
// ----------------------------------------------------
export async function getSiteTexts() {
    return siteData; // Mengembalikan seluruh struktur siteData
}

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
            tech_description: siteData.identity?.tech_description || "A high-performance architecture built with the best tools in the industry.", 
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

export async function getWorkPhases() {
    return workPhasesData;
}

export async function getTechStacks() {
    return skillsData;
}

export async function getSocialLinks() {
    return socialsData;
}

export async function getProjects() {
    return projectsData.map(p => ({
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
