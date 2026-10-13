import React from 'react';
import { 
  HeartHandshake, 
  BookOpen, 
  Activity, 
  Users, 
  Sparkles, 
  Compass, 
  Check, 
  Flame, 
  RotateCcw,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReflectionItem } from '../types';

interface DailyChecklistProps {
  items: ReflectionItem[];
  completedIds: string[];
  streakDays: number;
  onToggleItem: (id: string) => void;
  onResetToday: () => void;
  hapticsEnabled: boolean;
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  items,
  completedIds,
  streakDays,
  onToggleItem,
  onResetToday,
  hapticsEnabled,
}) => {
  const completedCount = completedIds.length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  const handleToggle = (id: string) => {
    // Haptic feedback for touch devices
    if (hapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Safe ignore
      }
    }

    // Check if this action will complete the last unchecked item
    const isNowCompletingAll = !completedIds.includes(id) && completedIds.length + 1 === totalCount;
    if (isNowCompletingAll) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#10B981', '#06B6D4', '#38BDF8', '#F8FAFC']
        });
      } catch {
        // Safe fallback
      }
    }

    onToggleItem(id);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Compass':
      default:
        return <Compass className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section className="space-y-4 pt-2">
      {/* Header card with progress & streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Refleksi Harian
            </h2>
            {streakDays > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {streakDays} Hari Beruntun
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Otomatis di-reset setiap tengah malam (00:00)</span>
          </p>
        </div>

        {/* Progress summary & Reset button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-white font-mono">
              <span className="text-emerald-400">{completedCount}</span>
              <span className="text-slate-500"> / </span>
              <span>{totalCount}</span>
            </div>
            <span className="text-[11px] text-slate-400">{percentage}% Selesai</span>
          </div>

          <button
            onClick={() => {
              if (completedCount > 0 && window.confirm('Reset semua checklist hari ini?')) {
                onResetToday();
              }
            }}
            disabled={completedCount === 0}
            className={`p-2 rounded-xl border border-slate-800 transition ${
              completedCount > 0
                ? 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'text-slate-600 opacity-40 cursor-not-allowed'
            }`}
            title="Reset checklist hari ini"
            aria-label="Reset checklist hari ini"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const isDone = completedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] min-h-[64px] ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                  : 'bg-[#0E1524]/60 border-slate-800/90 hover:border-slate-700 hover:bg-[#131B2D]/80 text-slate-300'
              }`}
            >
              {/* Checkbox Touch Target */}
              <div className="pt-0.5 shrink-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'border-2 border-slate-700 bg-slate-900 group-hover:border-slate-500'
                  }`}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-medium tracking-wide uppercase text-slate-400">
                    {item.categoryLabel}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium leading-snug transition-colors ${
                    isDone ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-100'
                  }`}
                >
                  {item.question}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  {item.subtitle}
                </p>
              </div>

              {/* Category Subtle Icon */}
              <div className="shrink-0 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                {getCategoryIcon(item.iconName)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Affirmation Box */}
      {isAllCompleted && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/40 border border-emerald-500/30 text-center animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-emerald-300">
            Alhamdulillah, Seluruh Refleksi Hari Ini Selesai
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
            Anda telah melangkah satu hari lebih dekat menuju kematangan usia 40 tahun dengan penuh kesadaran, kebaikan, dan rasa syukur. Istirahatlah dengan damai malam ini.
          </p>
        </div>
      )}
    </section>
  );
};
