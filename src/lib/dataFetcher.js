import { DEV_CONFIG } from "../config/dev.config";
import siteDataLocal from "../data/siteData.json";
import projectsLocal from "../data/projects.json";

// URL Sumber Data (GitHub)
const REMOTE_URLS = {
    siteData: "https://raw.githubusercontent.com/zidan-idz/TM-Resources/refs/heads/main/My/siteData.json",
    projects: "https://raw.githubusercontent.com/zidan-idz/TM-Resources/refs/heads/main/My/projects.json"
};

// Logger helper
function log(message) {
    if (DEV_CONFIG.DEBUG_LOG) {
        console.log(message);
    }
}

/**
 * Ambil data dari GitHub. Jika gagal, pakai data lokal.
 * Di mode development, bisa skip fetch online.
 * @param {string} type - 'siteData' atau 'projects'
 * @param {object} localFallback - Data cadangan lokal
 */
async function fetchWithFallback(type, localFallback) {
    // DEV MODE: Skip online, langsung pakai lokal
    if (DEV_CONFIG.USE_LOCAL_DATA) {
        log(`[DEV] Pakai data lokal: ${type}`);
        return localFallback;
    }

    // PROD MODE: Fetch online dengan fallback
    try {
        const url = REMOTE_URLS[type];
        if (!url) throw new Error(`URL tak ditemukan: ${type}`);

        // Batas waktu fetch 3 detik
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(url, { 
            signal: controller.signal,
            cache: 'no-store' // Force fresh fetch, bypass Vercel cache
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Gagal fetch ${type}: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        log(`[PROD] Data dari online: ${type}`);
        return data;
    } catch (error) {
        // Gagal fetch, pakai lokal sebagai fallback
        log(`[FALLBACK] Pakai lokal '${type}'. Error: ${error.message}`);
        return localFallback;
    }
}

// Helper ringkas
export async function getSiteData() {
    return await fetchWithFallback('siteData', siteDataLocal);
}

export async function getProjects() {
    return await fetchWithFallback('projects', projectsLocal);
}

