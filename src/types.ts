export interface UserSettings {
  userName: string;
  birthDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD (Default: birthDate + 40 years)
  hapticsEnabled: boolean;
}

export interface ReflectionItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  subtitle: string;
  iconName: string;
}

export interface DailyReflectionState {
  date: string; // YYYY-MM-DD
  completedIds: string[];
  streakDays: number;
  lastCompletedDate?: string;
  history?: Record<string, { completedCount: number; totalCount: number }>;
}

export interface HistoryPoint {
  dateKey: string; // YYYY-MM-DD
  shortDate: string; // e.g. "13 Okt"
  dayLabel: string; // e.g. "13"
  completedCount: number;
  totalCount: number;
  completionRate: number; // percentage 0-100
  streak: number;
  isToday: boolean;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

export interface LifeProgressStats {
  percentage: number;
  daysLived: number;
  daysRemaining: number;
  totalDays: number;
  currentAgeYears: number;
}
