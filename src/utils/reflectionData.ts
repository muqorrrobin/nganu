import { ReflectionItem } from '../types';

export const DEFAULT_REFLECTION_ITEMS: ReflectionItem[] = [
  {
    id: 'ref-sedekah',
    category: 'sedekah',
    categoryLabel: 'Sedekah & Berbagi',
    question: 'Sudah bersedekah atau berbagi kebaikan hari ini?',
    subtitle: 'Sedekah subuh, infak, berbagi makanan, atau senyum tulus yang mempermudah urusan orang lain.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'ref-quran',
    category: 'quran',
    categoryLabel: 'Tilawah Al-Qur\'an',
    question: 'Sudah membaca Al-Qur\'an atau tadabbur ayat hari ini?',
    subtitle: 'Membaca satu juz, beberapa lembar, atau minimal satu ayat dengan pemaknaan mendalam.',
    iconName: 'BookOpen'
  },
  {
    id: 'ref-ibadah',
    category: 'ibadah',
    categoryLabel: 'Sholat & Dzikir',
    question: 'Apakah saya sudah menjaga sholat tepat waktu dan berdzikir hari ini?',
    subtitle: 'Menjaga hubungan dengan Sang Pencipta dan memohon ampunan serta keberkahan sisa usia.',
    iconName: 'Sparkles'
  },
  {
    id: 'ref-purpose',
    category: 'purpose',
    categoryLabel: 'Kebermanfaatan',
    question: 'Apakah tindakan saya hari ini sudah memberi manfaat bagi orang lain?',
    subtitle: 'Khairunnas anfa\'uhum linnas — sebaik-baik manusia adalah yang paling bermanfaat bagi sesama.',
    iconName: 'Users'
  },
  {
    id: 'ref-health',
    category: 'health',
    categoryLabel: 'Kesehatan & Raga',
    question: 'Apakah saya sudah menjaga amanah tubuh dengan nutrisi baik dan istirahat cukup?',
    subtitle: 'Menjaga kesehatan fisik dan konsumsi halal-thayyib agar tetap berdaya dan beramal hingga usia 40+.',
    iconName: 'Activity'
  },
  {
    id: 'ref-mindfulness',
    category: 'mindfulness',
    categoryLabel: 'Muhasabah Diri',
    question: 'Apakah saya sudah memaafkan orang lain dan bermuhasabah sebelum tidur?',
    subtitle: 'Menghilangkan rasa dendam, menjaga lisan, dan menutup hari dengan hati yang lapang dan bersih.',
    iconName: 'Compass'
  }
];
