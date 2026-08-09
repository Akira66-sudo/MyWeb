/**
 * ironDome.js
 * Sistem Filter Anti-Toxic & SARA Lanjutan (Iron Dome) - v2.0
 * Menggunakan pencocokan substring penuh (bukan word boundary)
 * agar tidak bisa dijebol dengan teknik penggabungan kata atau simbol.
 */

const badWords = [
  "anjing",
  "babi",
  "monyet",
  "bangsat",
  "kontol",
  "memek",
  "jembut",
  "ngentot",
  "peler",
  "pepek",
  "tolol",
  "goblok",
  "bego",
  "idiot",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "pussy",
  "cunt",
  "slut",
  "kafir",
  "lonte",
  "pelacur",
  "sialan",
  "bajingan",
  "keparat",
  "titit",
  "tete",
  "pantek",
  "pukimak",
  "kimak",
  "kampang",
  "lanciau",
  "bugil",
  "bokep",
  "telanjang",
  "ngecrot",
  "ngewe",
  "kenthu",
  "asu",
  "asw",
  "dajjal",
  "setan",
  "iblis"
];

/**
 * Daftar kata aman (Whitelist) yang mengandung potongan kata yang
 * mirip kata kasar tetapi merupakan nama atau kata normal.
 * Sebelum pemindaian, setiap kata dalam daftar ini akan DIHAPUS
 * dari teks input agar tidak terjadi False Positive.
 */
const safeSubstrings = [
  "basuki",
  "panji",
  "tanjung",
  "sanjaya",
  "dickson",
  "dicky",
  "ricky",
  "micky",
  "gay",       // gayatri, etc.
  "gayatri",
  "titus",
  "tito",
  "titin",
  "habibi",
  "babita",
  "anjani",
  "anjas",
  "anjasmara",
  "anjar",
  "anjur",     // menganjurkan, dll
  "mamak",
  "mamik",
  "mumuk",
  "jembatan",
  "jembatani",
  "kantil",
  "banjir",
  "sanjay",
  "masuk",
  "pasukan",
  "aswin",
  "aswad",
  "aswar",
  "teteh",
  "kasur",
  "assalamualaikum",
  "assassin",
  "classic",
  "assistant",
  "suka",
  "kasih",
  "asuh",
  "asul",
  "pasukan",
  "bersuka",
  "susah",
  "usaha"
];

/**
 * Peta penggantian karakter Leetspeak ke pola regex.
 * Kunci: huruf asli. Nilai: kelas karakter regex yang cocok.
 */
const charMap = {
  a: "[aA4@*^]",
  b: "[bB8]",
  c: "[cC(]",
  e: "[eE3]",
  g: "[gG96]",
  i: "[iI1!|]",
  l: "[lL1|I]",
  o: "[oO0]",
  s: "[sS5$]",
  t: "[tT7]",
  u: "[uUvV*]"
};

/**
 * Membangun Regular Expression (RegEx) TANPA word boundary (\b)
 * agar kata kasar terdeteksi di mana saja (awal, tengah, akhir kata gabungan).
 *
 * @param {string} word - Kata dasar yang ingin dicegah.
 * @returns {RegExp} Objek regex substring yang sudah dirakit.
 */
function buildRegex(word) {
  let pattern = "";
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    const charPattern = charMap[char] || `[${char.toLowerCase()}${char.toUpperCase()}]`;
    let token = charPattern + "+";
    if (i < word.length - 1) {
      token += "[\\W_]*";
    }
    pattern += token;
  }
  // Kata pendek (<=3 huruf) pakai word boundary agar tidak false positive di kata biasa
  // Kata panjang (>=4 huruf) pakai substring match agar tidak bisa dibypass
  if (word.length <= 3) {
    return new RegExp(`(?<![a-zA-Z])${pattern}(?![a-zA-Z])`, "i");
  }
  return new RegExp(pattern, "i");
}

// Pra-kompilasi semua regex agar pengecekan lebih cepat saat fungsi dipanggil
const badWordRegexes = badWords.map((bw) => ({ word: bw, regex: buildRegex(bw) }));

// Pra-kompilasi regex untuk whitelist (kata aman) — untuk dihapus sebelum scan
const safeSubstringRegexes = safeSubstrings.map((s) => new RegExp(s, "gi"));

/**
 * Mengevaluasi apakah suatu teks mengandung kata kasar/toxic.
 * Menggunakan strategi "hapus kata aman dulu, baru pindai".
 *
 * @param {string} text - Teks input dari pengguna yang akan dievaluasi.
 * @returns {boolean} True jika teks toxic, False jika teks bersih/aman.
 */
export function isToxic(text) {
  if (!text) return false;

  // Langkah 1: Normalisasi input (lowercase, trim)
  let normalized = text.trim().toLowerCase();

  // Langkah 2: Hapus semua kata aman dari input sebelum pemindaian.
  // Ini mencegah False Positive pada nama seperti "Basuki", "Dicky", "Anjani".
  // Contoh: "Basuki123Babi" -> hapus "basuki" -> "123Babi" -> terdeteksi "babi"!
  for (const safeRgx of safeSubstringRegexes) {
    normalized = normalized.replace(safeRgx, " ");
  }
  normalized = normalized.trim();

  // Langkah 3: Pemindaian Substring Penuh (Matrix Pattern Match)
  // Memeriksa dengan kombinasi huruf/leetspeak tanpa batasan word boundary
  for (const { regex } of badWordRegexes) {
    if (regex.test(normalized)) {
      return true;
    }
  }

  // Langkah 4: Fallback — Pencocokan Tanda Tangan Konsonan
  // Berguna untuk kata kasar yang sangat disingkat (misal: "KNTL" tanpa huruf vokal)
  const badSignatures = [
    "ngntt",
    "ngntd",
    "kntl",
    "qntl",
    "kndl",
    "qndl",
    "mmk",
    "mmx",
    "jmbt",
    "bgst",
    "njng",
    "njr",
    "njt",
    "njy",
    "nggr",
    "fgt"
  ];

  // Menghapus semua huruf vokal, angka, dan karakter spesial
  let noVowels = normalized.replace(/[aeiou0-9\W_]/g, "");
  // Menyusutkan konsonan berulang (misal: "knttlll" menjadi "kntl")
  let signature = noVowels.replace(/(.)\1+/g, "$1");

  if (badSignatures.some((sig) => signature.includes(sig))) {
    return true;
  }

  return false;
}
