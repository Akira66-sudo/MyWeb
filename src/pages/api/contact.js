/**
 * Rute API: /api/contact
 * Fungsi utama untuk menangani pengiriman pesan dari formulir kontak.
 * Akan menyaring konten kotor dan meneruskannya ke Web3Forms jika aman.
 */
import { isToxic } from "../../lib/ironDome.js";

// Beritahu Astro bahwa file ini dirender secara dinamis di server (Server-Side Rendering)
export const prerender = false;

/**
 * Endpoint POST untuk menerima data form kontak.
 */
export async function POST({ request }) {
  try {
    const data = await request.json();

    // 1. Validasi Input: Pastikan semua kolom penting sudah terisi
    if (!data.name || !data.email || !data.message || !data.access_key) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Incomplete data"
        }),
        { status: 400 } // Kode 400: Bad Request
      );
    }

    // 2. Iron Dome: Cegat Pesan Kotor/Toxic
    // Gabungkan nama dan pesan untuk dievaluasi oleh sistem filter
    const rawContent = data.name + " " + data.message;

    if (isToxic(rawContent)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "TRANSMISSION BLOCKED: Inappropriate content detected."
        }),
        { status: 403 } // Kode 403: Akses Dilarang
      );
    }

    // 3. Teruskan ke Web3Forms
    // Jika lolos sensor, kirim pesan ke layanan email Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // 4. Tanggapan Balik
    if (response.status === 200) {
      return new Response(JSON.stringify(result), { status: 200 }); // Sukses
    } else {
      return new Response(JSON.stringify(result), { status: response.status }); // Gagal dari penyedia
    }
  } catch (error) {
    // Penanganan error internal jika API atau server bermasalah
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server encountered an error while processing the transmission."
      }),
      { status: 500 } // Kode 500: Internal Server Error
    );
  }
}
