/**
 * Rute API: /api/stats
 * Mengelola sistem analitik sederhana (Page Views & Likes).
 */

export const prerender = false; // Wajib server-side (Tidak di-build statis)

import { getStats, incrementViews, incrementLikes } from "../../lib/db";

/**
 * Endpoint GET: Digunakan saat halaman pertama kali dimuat
 * untuk mengambil total views dan likes saat ini.
 */
export async function GET() {
  try {
    const stats = await getStats();
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

/**
 * Endpoint POST: Digunakan saat ada event (halaman dibuka atau tombol like diklik)
 * Menerima payload JSON: { type: "view" } atau { type: "like" }
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    let stats;

    if (body.type === "view") {
      stats = await incrementViews();
    } else if (body.type === "like") {
      stats = await incrementLikes();
    } else {
      stats = await getStats();
    }

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
