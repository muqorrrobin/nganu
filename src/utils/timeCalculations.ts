import { CountdownTime, LifeProgressStats } from '../types';

/**
 * Mendapatkan string tanggal hari ini dalam format lokal YYYY-MM-DD
 */
export function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Menambahkan jumlah tahun ke tanggal ISO
 */
export function addYearsToDate(dateStr: string, years: number): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10) + years;
      return `${year}-${parts[1]}-${parts[2]}`;
    }
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().split('T')[0];
  } catch {
    return '2034-01-01';
  }
}

/**
 * Menghitung countdown real-time ke tanggal target
 */
export function calculateCountdown(targetDateStr: string): CountdownTime {
  const target = new Date(`${targetDateStr}T00:00:00`).getTime();
  const now = Date.now();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isPast: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isPast: false,
  };
}

/**
 * Menghitung persentase dan statistik progres perjalanan hidup
 */
export function calculateLifeProgress(birthDateStr: string, targetDateStr: string): LifeProgressStats {
  const birth = new Date(`${birthDateStr}T00:00:00`).getTime();
  const target = new Date(`${targetDateStr}T00:00:00`).getTime();
  const now = Date.now();

  const totalSpan = Math.max(1, target - birth);
  const elapsed = Math.max(0, now - birth);
  const rawPercentage = (elapsed / totalSpan) * 100;
  const percentage = Math.min(100, Math.max(0, Number(rawPercentage.toFixed(1))));

  const daysLived = Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, Math.floor((target - now) / (1000 * 60 * 60 * 24)));
  const totalDays = Math.max(1, Math.floor(totalSpan / (1000 * 60 * 60 * 24)));
  const currentAgeYears = Number((elapsed / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));

  return {
    percentage,
    daysLived,
    daysRemaining,
    totalDays,
    currentAgeYears,
  };
}

/**
 * Format tanggal Indonesia: "15 Mei 2030"
 */
export function formatDateIndonesian(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${day} ${monthNames[monthIdx] || ''} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Format hari & tanggal lengkap hari ini: "Selasa, 13 Oktober 2026"
 */
export function formatFullTodayIndonesian(): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateNum = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}
