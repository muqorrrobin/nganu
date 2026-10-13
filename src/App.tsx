/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserSettings, ReflectionItem, DailyReflectionState, CountdownTime, LifeProgressStats } from './types';
import { DEFAULT_REFLECTION_ITEMS } from './utils/reflectionData';
import { 
  getTodayLocalDateString, 
  calculateCountdown, 
  calculateLifeProgress, 
  addYearsToDate 
} from './utils/timeCalculations';
import { usePWAInstall } from './hooks/usePWAInstall';
import { TopBar } from './components/TopBar';
import { HeroCountdown } from './components/HeroCountdown';
import { DailyChecklist } from './components/DailyChecklist';
import { SettingsModal } from './components/SettingsModal';
import { IOSInstallModal } from './components/IOSInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';

import { MonthlyProgress } from './components/MonthlyProgress';

const STORAGE_KEY_SETTINGS = 'refleksi40_settings_v1';
const STORAGE_KEY_DAILY = 'refleksi40_daily_v1';
const STORAGE_KEY_ITEMS = 'refleksi40_items_v1';

const DEFAULT_SETTINGS: UserSettings = {
  userName: '',
  birthDate: '1994-01-01',
  targetDate: '2034-01-01',
  hapticsEnabled: true,
};

export default function App() {
  // PWA install hook
  const { isInstallable, isInstalled, isIOS, install: installPWA } = usePWAInstall();

  // Settings State
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Reflection items list (Customizable, defaults to Sedekah, Quran, Ibadah, dll.)
  const [reflectionItems, setReflectionItems] = useState<ReflectionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_REFLECTION_ITEMS;
  });

  // Daily Reflection State with Auto-Reset Logic
  const [dailyState, setDailyState] = useState<DailyReflectionState>(() => {
    const today = getTodayLocalDateString();
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY);
      if (saved) {
        const parsed: DailyReflectionState = JSON.parse(saved);
        if (parsed.date === today) {
          return parsed;
        } else {
          // New day! Calculate streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yDateStr = yesterday.toISOString().split('T')[0];
          
          const isStreakContinuing = parsed.date === yDateStr && parsed.completedIds.length === reflectionItems.length;
          const newStreak = isStreakContinuing ? parsed.streakDays : 0;

          return {
            date: today,
            completedIds: [],
            streakDays: newStreak,
            lastCompletedDate: parsed.lastCompletedDate,
          };
        }
      }
    } catch {
      // Ignore
    }

    return {
      date: today,
      completedIds: [],
      streakDays: 0,
    };
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIOSGuideOpen, setIsIOSGuideOpen] = useState(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState<CountdownTime>(() => 
    calculateCountdown(settings.targetDate)
  );

  // Life progress stats
  const lifeStats: LifeProgressStats = useMemo(() => {
    return calculateLifeProgress(settings.birthDate, settings.targetDate);
  }, [settings.birthDate, settings.targetDate]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(reflectionItems));
    } catch {
      // Ignore
    }
  }, [reflectionItems]);

  // Persist daily state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(dailyState));
    } catch {
      // Ignore
    }
  }, [dailyState]);

  // Midnight Auto-Reset Checker
  const checkMidnightReset = useCallback(() => {
    const today = getTodayLocalDateString();
    setDailyState((prev) => {
      if (prev.date !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yDateStr = yesterday.toISOString().split('T')[0];

        const isStreakContinuing = prev.date === yDateStr && prev.completedIds.length === reflectionItems.length;
        const newStreak = isStreakContinuing ? prev.streakDays : 0;

        return {
          date: today,
          completedIds: [],
          streakDays: newStreak,
          lastCompletedDate: prev.lastCompletedDate,
        };
      }
      return prev;
    });
  }, [reflectionItems.length]);

  // Real-time ticking (1000ms interval) & midnight auto-reset listener
  useEffect(() => {
    const tick = () => {
      setCountdown(calculateCountdown(settings.targetDate));
      checkMidnightReset();
    };

    tick();
    const interval = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        tick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [settings.targetDate, checkMidnightReset]);

  // Checklist toggle handler
  const handleToggleChecklist = (id: string) => {
    setDailyState((prev) => {
      const isAlreadyCompleted = prev.completedIds.includes(id);
      const newCompletedIds = isAlreadyCompleted
        ? prev.completedIds.filter((item) => item !== id)
        : [...prev.completedIds, id];

      const allCompleted = newCompletedIds.length === reflectionItems.length;
      let newStreak = prev.streakDays;
      let lastCompletedDate = prev.lastCompletedDate;

      if (allCompleted && prev.lastCompletedDate !== prev.date) {
        newStreak = prev.streakDays + 1;
        lastCompletedDate = prev.date;
      }

      // Record daily history for 30-day Recharts visualization
      const updatedHistory = {
        ...(prev.history || {}),
        [prev.date]: {
          completedCount: newCompletedIds.length,
          totalCount: reflectionItems.length,
        },
      };

      return {
        ...prev,
        completedIds: newCompletedIds,
        streakDays: newStreak,
        lastCompletedDate,
        history: updatedHistory,
      };
    });
  };

  // Manual reset for testing/convenience
  const handleResetToday = () => {
    setDailyState((prev) => {
      const updatedHistory = {
        ...(prev.history || {}),
        [prev.date]: {
          completedCount: 0,
          totalCount: reflectionItems.length,
        },
      };

      return {
        ...prev,
        completedIds: [],
        history: updatedHistory,
      };
    });
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    if (!newSettings.targetDate && newSettings.birthDate) {
      newSettings.targetDate = addYearsToDate(newSettings.birthDate, 40);
    }
    setSettings(newSettings);
    setCountdown(calculateCountdown(newSettings.targetDate));
  };

  const handleUpdateItems = (newItems: ReflectionItem[]) => {
    setReflectionItems(newItems);
    // Cleanup completedIds if any deleted
    const validIds = new Set(newItems.map(i => i.id));
    setDailyState(prev => ({
      ...prev,
      completedIds: prev.completedIds.filter(id => validIds.has(id))
    }));
  };

  const handleResetItemsToDefault = () => {
    setReflectionItems(DEFAULT_REFLECTION_ITEMS);
    localStorage.removeItem(STORAGE_KEY_ITEMS);
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <TopBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        isInstallable={isInstallable}
        isIOS={isIOS}
        isInstalled={isInstalled}
        onInstallPWA={installPWA}
        onOpenIOSGuide={() => setIsIOSGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8">
        {/* Section 1: Top Section - Countdown Clock, Life Progress, & Daily Quote */}
        <HeroCountdown
          countdown={countdown}
          lifeStats={lifeStats}
          settings={settings}
        />

        {/* Section 2: Middle Section - Daily Reflection Checklist */}
        <DailyChecklist
          items={reflectionItems}
          completedIds={dailyState.completedIds}
          streakDays={dailyState.streakDays}
          onToggleItem={handleToggleChecklist}
          onResetToday={handleResetToday}
          hapticsEnabled={settings.hapticsEnabled}
        />

        {/* Section 3: Monthly Progress Component (Recharts 30-Day Streak & Completion Rate) */}
        <MonthlyProgress
          history={dailyState.history}
          currentCompletedCount={dailyState.completedIds.length}
          currentTotalCount={reflectionItems.length}
          currentStreak={dailyState.streakDays}
        />
      </main>

      {/* Zen Quiet Footer */}
      <footer className="w-full border-t border-slate-900/80 bg-[#070B10] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-md mx-auto space-y-2">
          <p className="font-medium text-slate-400">
            Refleksi 40 · Mengingat Waktu, Menyemai Kebaikan
          </p>
          <p className="text-[11px] text-slate-600">
            Data tersimpan aman di perangkat Anda secara offline. Auto-reset setiap 00:00.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentSettings={settings}
        items={reflectionItems}
        onSave={handleSaveSettings}
        onUpdateItems={handleUpdateItems}
        onResetItemsToDefault={handleResetItemsToDefault}
        onClose={() => setIsSettingsOpen(false)}
        onResetTodayChecklist={handleResetToday}
      />

      {/* iOS Safari Installation Guide Modal */}
      <IOSInstallModal
        isOpen={isIOSGuideOpen}
        onClose={() => setIsIOSGuideOpen(false)}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
