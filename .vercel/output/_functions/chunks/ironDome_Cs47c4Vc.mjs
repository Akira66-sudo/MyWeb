/**
 * ironDome.js
 * Sistem Filter Anti-Toxic & SARA Lanjutan (Iron Dome)
 * Menggunakan pencocokan pola matriks (Matrix Pattern Matching) dan
 * normalisasi Leetspeak (penggantian huruf dengan angka/simbol).
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

const safeNames = [
  "basuki",
  "panji",
  "tanjung",
  "sanjaya",
  "dickson",
  "gayatri",
  "titus",
  "tito",
  "titin",
  "habibi",
  "babita",
  "anjani",
  "anjas",
  "anjasmara",
  "mamak",
  "mamik",
  "mumuk",
  "jembatan",
  "kantil",
  "banjir",
  "sanjay"
];

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
 * Membangun Regular Expression (RegEx) yang kuat untuk satu kata kasar.
 * Fungsi ini akan mengubah kata (misal: "babi") menjadi pola yang bisa
 * menangkap variasi seperti "b@b1", "b a b i", "b-a-b-i", dll.
 *
 * @param {string} word - Kata dasar yang ingin dicegah.
 * @returns {RegExp} Objek regex yang sudah dirakit.
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
  return new RegExp(`\\b${pattern}\\b`, "i");
}

// Pra-kompilasi semua regex agar pengecekan lebih cepat saat fungsi dipanggil
const badWordRegexes = badWords.map((bw) => buildRegex(bw));

/**
 * Mengevaluasi apakah suatu teks mengandung kata kasar/toxic.
 *
 * @param {string} text - Teks input dari pengguna yang akan dievaluasi.
 * @returns {boolean} True jika teks toxic, False jika teks bersih/aman.
 */
function isToxic(text) {
  if (!text) return false;

  // 1. Pengecekan Daftar Putih (Whitelist Check)
  // Memastikan nama-nama normal (seperti Basuki) tidak terblokir salah sasaran
  const normalizedText = text.trim().toLowerCase();
  if (safeNames.includes(normalizedText)) {
    return false;
  }

  // 2. Pencocokan Pola Matriks (Matrix Pattern Match)
  // Memeriksa dengan kombinasi huruf/leetspeak yang sudah dipra-kompilasi
  for (const rx of badWordRegexes) {
    if (rx.test(normalizedText)) {
      return true;
    }
  }

  // 3. Fallback (Pencocokan Tanda Tangan Konsonan)
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
  let noVowels = normalizedText.replace(/[aeiou0-9\W_]/g, "");
  // Menyusutkan konsonan berulang (misal: "knttlll" menjadi "kntl")
  let signature = noVowels.replace(/(.)\1+/g, "$1");

  if (badSignatures.some((sig) => signature.includes(sig))) {
    return true;
  }

  return false;
}

export { isToxic as i };
