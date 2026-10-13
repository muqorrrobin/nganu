import React, { useState } from 'react';
import { Sparkles, Compass, Check, Copy, RefreshCw } from 'lucide-react';
import { CountdownTime, LifeProgressStats, UserSettings } from '../types';
import { formatDateIndonesian } from '../utils/timeCalculations';
import { Quote, REFLECTION_QUOTES, getDailyQuote } from '../utils/quotes';

interface HeroCountdownProps {
  countdown: CountdownTime;
  lifeStats: LifeProgressStats;
  settings: UserSettings;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  countdown,
  lifeStats,
  settings,
}) => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(getDailyQuote);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleNextQuote = () => {
    const currentIndex = REFLECTION_QUOTES.findIndex(q => q.text === currentQuote.text);
    const nextIndex = (currentIndex + 1) % REFLECTION_QUOTES.length;
    setCurrentQuote(REFLECTION_QUOTES[nextIndex]);
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const formattedTargetDate = formatDateIndonesian(settings.targetDate);

  return (
    <section className="space-y-6 pt-2">
      {/* Daily Quote Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-b from-[#0F172A]/70 to-[#0A0E17]/80 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Refleksi Hari Ini</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyQuote}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              title="Salin kutipan"
              aria-label="Salin kutipan"
            >
              {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleNextQuote}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              title="Ganti kutipan"
              aria-label="Ganti kutipan"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg font-normal text-slate-100 leading-relaxed italic">
          "{currentQuote.text}"
        </blockquote>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">— {currentQuote.author}</span>
          {currentQuote.source && (
            <span className="text-slate-500 hidden sm:inline">{currentQuote.source}</span>
          )}
        </div>
      </div>

      {/* Primary Real-Time Countdown Box */}
      <div className="rounded-3xl border border-slate-800/90 bg-[#0E1524]/60 p-5 sm:p-8 backdrop-blur-md relative overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Sisa Waktu Menuju Usia 40
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target kematangan akal & jiwa: <span className="text-slate-300 font-medium">{formattedTargetDate}</span>
            </p>
          </div>
          {settings.userName && (
            <span className="text-xs text-slate-400 self-start sm:self-auto">
              Untuk: <span className="text-slate-200 font-medium">{settings.userName}</span>
            </span>
          )}
        </div>

        {countdown.isPast ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Selamat Menapaki Usia Emas 40+</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Anda telah melewati tonggak usia 40 tahun. Setiap hari baru adalah lembaran keberkahan, kematangan, dan amal jariyah terbaik Anda.
            </p>
          </div>
        ) : (
          /* Live Countdown Digits */
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {/* Hari */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
              <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums">
                {countdown.days.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                Hari
              </span>
            </div>

            {/* Jam */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
              <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                Jam
              </span>
            </div>

            {/* Menit */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
              <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1.5">
                Menit
              </span>
            </div>

            {/* Detik */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40 transition-colors">
              <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-emerald-400 tabular-nums">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-emerald-400/80 uppercase tracking-wider mt-1.5">
                Detik
              </span>
            </div>
          </div>
        )}

        {/* Life Progress Bar Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="text-slate-400 font-medium">Perjalanan Menuju Usia 40</span>
            <div className="flex items-center gap-2 font-mono text-slate-300">
              <span className="text-emerald-400 font-semibold">{lifeStats.percentage}%</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{lifeStats.currentAgeYears} Tahun</span>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out"
              style={{ width: `${lifeStats.percentage}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>{lifeStats.daysLived.toLocaleString('id-ID')} hari telah dijalani</span>
            <span>{countdown.isPast ? 'Target tercapai' : `${lifeStats.daysRemaining.toLocaleString('id-ID')} hari tersisa`}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
