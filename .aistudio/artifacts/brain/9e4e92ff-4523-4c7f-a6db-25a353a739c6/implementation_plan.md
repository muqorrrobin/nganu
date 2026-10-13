# Countdown to 40 & Daily Reflection (PWA)

Aplikasi Progressive Web App (PWA) minimalis dan reflektif untuk menghitung mundur sisa waktu menuju usia 40 tahun secara real-time, dipadukan dengan checklist evaluasi harian otomatis dan visualisasi waktu hidup bernuansa Zen Dark Mode.

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan utama telah diselaraskan dengan preferensi Anda:

- **Target Usia 40 Tahun**: Pengguna dapat mengatur tanggal lahir dan target 40 tahun secara fleksibel di menu Pengaturan (dengan nilai bawaan default yang langsung aktif).
- **Checklist Refleksi Harian**: Menggunakan 6 butir pertanyaan reflektif bawaan yang berbobot (makna hidup, kontribusi, pembelajaran, kesehatan, keluarga, dan rasa syukur) dengan sistem auto-reset tepat pukul 00:00 setiap pergantian hari.
- **Arah Visual & Tema**: *Zen Dark Mode Minimalis* dengan palet Obsidian/Deep Slate, tipografi tabular berpresisi tinggi, dan aksen tenang (*Tranquil Emerald & Slate*).
- **PWA & Standalone iOS Support**: Dilengkapi metadata Apple Touch Icon, standalone display mode, deteksi instalasi native browser (Chromium/Android), serta panduan langkah instalasi khusus iPhone/Safari.

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Aplikasi mobile-first PWA yang membantu pengguna menyadari betapa berharganya waktu (*memento mori*) menuju usia kematangan 40 tahun, sekaligus membiasakan introspeksi harian yang bermakna sebelum menutup hari.
- **Target Pengguna**: Individu produktif dan mindful yang ingin menghargai setiap detik hidup, menjaga kebiasaan positif, dan memiliki panduan refleksi harian tanpa distraksi.
- **Nilai Utama**:
  1. *Persepsi Waktu Nyata*: Countdown detik-demi-detik yang tenang dan tidak menimbulkan panik, melainkan rasa syukur dan fokus.
  2. *Progress Bar Kehidupan*: Visualisasi proporsi waktu yang telah dilalui vs sisa waktu menuju usia 40 tahun.
  3. *Refleksi Tanpa Beban*: 6 pertanyaan sederhana yang otomatis ter-reset setiap tengah malam dengan penyimpanan lokal aman di browser.
  4. *Offline-Ready & Native Feel*: Berjalan lancar tanpa internet, bisa ditambahkan ke Home Screen ponsel tanpa bilah alamat browser.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Layar Utama (Hero Countdown)**:
   - Pengguna disambut oleh kutipan reflektif hari ini (berganti setiap hari).
   - Angka countdown besar (Hari, Jam, Menit, Detik) dengan format angka monospace/tabular (`tabular-nums`) yang bergerak tenang.
   - Bilah *Life Progress Bar* (persentase usia berjalan menuju 40 tahun) dengan label tanggal target.
2. **Bagian Tengah (Daily Reflection)**:
   - Kartu progres harian ("X dari 6 refleksi selesai hari ini").
   - 6 butir checklist harian dengan tombol tap responsif ($\ge 48\text{px}$ touch hitbox), haptic-friendly, dan animasi centang lembut.
   - Pesan apresiasi dan ketenangan saat seluruh checklist selesai 100%.
3. **Menu Pengaturan & Info PWA**:
   - Modal Pengaturan yang mudah dijangkau untuk mengubah tanggal lahir / tanggal target 40 tahun.
   - Tombol "Install App" (Chromium) atau panduan pop-up khusus iOS Safari ("Add to Home Screen").
   - Status offline indicator ramah pengguna saat koneksi terputus.

### Visual Identity & Theme Tokens
- **Tema**: Zen Dark Mode Minimalis.
- **Palet Warna**:
  - *Dominant Canvas (60%)*: Obsidian Black `#090D14` & Midnight `#0F172A`.
  - *Surfaces & Borders (30%)*: Card Surface `#141C2E`, Hairline Border `#1E293B`, Muted Slate `#64748B`.
  - *Accent & State (10%)*: Tranquil Emerald `#10B981` (refleksi selesai & tombol aktif), Cyan Light `#38BDF8` (indikator waktu).
- **Tipografi**:
  - Teks Utama & Judul: Sans-serif modern berkelas (`Plus Jakarta Sans` / clean system stack).
  - Countdown Numerik: Tabular Numbers (`tabular-nums font-mono`) agar angka tidak bergetar/goyang saat detik berubah.
- **Disiplin Anti-Slop**:
  - Tanpa badge pil berlebihan atau label telemetry palsu.
  - Hirarki vertikal bersih, jarak tap nyaman untuk penggunaan satu tangan di smartphone.

---

## 3. Key Product Decisions & Trade-Offs

- **State Management & Persistensi**:
  - *Pilihan*: React State tersinkronisasi otomatis dengan `localStorage` browser.
  - *Alasan*: Bekerja 100% offline tanpa perlu login server, data pribadi tersimpan aman di perangkat pengguna, dan instan tanpa latensi jaringan.
- **Logika Auto-Reset Tengah Malam**:
  - *Pilihan*: Pengecekan berbasis tanggal ISO lokal (`YYYY-MM-DD`). Setiap kali aplikasi dibuka atau melewati pergantian hari jam 00:00, tanggal tersimpan dibandingkan dengan hari ini. Jika berbeda, checklist direset bersih.
  - *Alasan*: Andal bahkan jika aplikasi ditutup semalaman atau dibuka kembali beberapa hari kemudian.
- **Dukungan PWA & Instalasi iOS**:
  - *Pilihan*: Menggunakan konfigurasi Web App Manifest, Service Worker (`vite-plugin-pwa`), meta tags khusus Apple Web App (`apple-mobile-web-app-capable`), serta komponen modal panduan instalasi Safari untuk perangkat iOS.
  - *Alasan*: Safari di iOS tidak mendukung event otomatis `beforeinstallprompt`, sehingga panduan visual step-by-step adalah standar emas industri untuk iPhone.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      PWA Application Shell                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐       ┌─────────────────────────┐  │
│  │ Top Navigation & Action │       │  PWA Install & Status   │  │
│  │ • Brand "Refleksi 40"   │       │  • Install CTA/iOS Guide│  │
│  │ • Settings Gear Modal   │       │  • Offline Banner       │  │
│  └────────────┬────────────┘       └────────────┬────────────┘  │
│               │                                 │               │
│               ▼                                 ▼               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Hero Section: Live Real-Time Countdown                    │  │
│  │ • Days · Hours · Minutes · Seconds (1000ms tick)          │  │
│  │ • Life Progress Bar (% of life towards age 40)            │  │
│  │ • Daily Mindfulness Quote Generator                       │  │
│  └────────────────────────────┬──────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Middle Section: Daily Reflection Checklist               │  │
│  │ • 6 Core Reflective Questions                             │  │
│  │ • Completion Counter & Streak Badge                       │  │
│  │ • Auto-Reset Engine (midnight 00:00 check)                │  │
│  └────────────────────────────┬──────────────────────────────┘  │
│                               │                                 │
│                               ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Persistence Layer: LocalStorage                           │  │
│  │ • birthDate, targetAgeDate, checklistState, lastActiveDate│  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model & State Entities
```typescript
interface UserSettings {
  birthDate: string; // ISO format (e.g. "1990-05-15")
  targetDate: string; // Calculated 40th birthday (e.g. "2030-05-15")
  hapticsEnabled: boolean;
}

interface ReflectionItem {
  id: string;
  question: string;
  subtitle: string;
  category: 'purpose' | 'growth' | 'health' | 'relationships' | 'gratitude' | 'mindfulness';
}

interface DailyRecord {
  date: string; // "YYYY-MM-DD"
  completedItemIds: string[];
}
```

### 6 Butir Refleksi Bawaan (Default Curated List)
1. **Kebermanfaatan**: *"Apakah hari ini tindakan saya telah memberi manfaat bagi orang lain?"*
2. **Pertumbuhan Diri**: *"Apakah saya meluangkan waktu belajar hal baru atau membaca hari ini?"*
3. **Kesehatan & Raga**: *"Apakah saya telah menjaga tubuh dengan makanan sehat, hidrasi, dan gerak aktif?"*
4. **Keluarga & Relasi**: *"Apakah saya sudah menyapa, mendengar, atau hadir penuh untuk keluarga/orang terdekat?"*
5. **Rasa Syukur**: *"Apakah saya mensyukuri minimal tiga hal sederhana yang terjadi sepanjang hari ini?"*
6. **Ketenangan Batin**: *"Apakah saya mampu mengendalikan amarah dan menjaga kedamaian pikiran hari ini?"*
