import { i as isToxic } from '../../chunks/ironDome_Cs47c4Vc.mjs';
export { renderers } from '../../renderers.mjs';

/**
 * Rute API: /api/contact
 * Fungsi utama untuk menangani pengiriman pesan dari formulir kontak.
 * Akan menyaring konten kotor dan meneruskannya ke Web3Forms jika aman.
 */

// Beritahu Astro bahwa file ini dirender secara dinamis di server (Server-Side Rendering)
const prerender = false;

/**
 * Endpoint POST untuk menerima data form kontak.
 */
async function POST({ request }) {
  try {
    const data = await request.json();

    // 1. Validasi Input: Pastikan semua kolom penting sudah terisi
    if (!data.name || !data.email || !data.message || !data.access_key) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Data tidak lengkap"
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
          message: "TRANSMISI DIBLOKIR: Terdeteksi konten tidak pantas."
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
        message: "Server mengalami gangguan saat memproses transmisi."
      }),
      { status: 500 } // Kode 500: Internal Server Error
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
