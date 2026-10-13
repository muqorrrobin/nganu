export interface Quote {
  text: string;
  author: string;
  source?: string;
}

export const REFLECTION_QUOTES: Quote[] = [
  {
    text: "Bukan karena hari-hari kita yang sedikit, tetapi karena kita banyak menyia-nyiakannya.",
    author: "Seneca",
    source: "De Brevitate Vitae"
  },
  {
    text: "Waktu ibarat pedang. Jika engkau tidak menebasnya, dialah yang akan menebasmu.",
    author: "Imam Asy-Syafi'i",
  },
  {
    text: "Usia 40 tahun adalah gerbang kematangan akal dan kedalaman jiwa. Setiap hembusan nafas adalah amanah.",
    author: "Refleksi Hikmah",
  },
  {
    text: "Hari kemarin adalah kenangan, hari esok adalah harapan, namun hari ini adalah satu-satunya kenyataan yang kita miliki.",
    author: "Ali bin Abi Thalib",
  },
  {
    text: "Hidup ini laksana air sungai yang mengalir deras, tak akan pernah kembali ke hulunya.",
    author: "Buya Hamka",
  },
  {
    text: "Ingatlah bahwa setiap hari yang berlalu adalah bagian dari dirimu yang tak akan pernah kembali.",
    author: "Hasan Al-Bashri",
  },
  {
    text: "Bukan panjangnya usia yang utama, melainkan apa yang telah engkau isi di dalam bentang waktu itu.",
    author: "Marcus Aurelius",
    source: "Meditations"
  },
  {
    text: "Jadilah seperti pohon yang berbuah lebat di pinggir jalan; dilempari batu, namun membalas dengan buah manis.",
    author: "Hikmah Timur",
  },
  {
    text: "Ketenangan batin dimulai saat kita berhenti membandingkan langkah kita dengan langkah orang lain.",
    author: "Petuah Zen",
  },
  {
    text: "Tanyakan pada dirimu setiap petang: 'Kebaikan apa yang telah kutanam hari ini bagi sesama?'",
    author: "Pythagoras",
  }
];

export function getDailyQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % REFLECTION_QUOTES.length;
  return REFLECTION_QUOTES[index];
}
