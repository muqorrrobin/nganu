import React from 'react';
import { Settings, Download, Smartphone } from 'lucide-react';
import { formatFullTodayIndonesian } from '../utils/timeCalculations';

interface TopBarProps {
  onOpenSettings: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  isInstalled: boolean;
  onInstallPWA: () => void;
  onOpenIOSGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSettings,
  isInstallable,
  isIOS,
  isInstalled,
  onInstallPWA,
  onOpenIOSGuide,
}) => {
  const formattedToday = formatFullTodayIndonesian();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D14]/85 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark with subtle Zen dot */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
            Refleksi 40
          </span>
        </div>

        {/* Zone 2: Clean unboxed date text */}
        <div className="hidden sm:flex items-center text-xs text-slate-400 whitespace-nowrap">
          <span>{formattedToday}</span>
        </div>

        {/* Zone 3: Actions (PWA install + Settings) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* PWA Install Button for Chromium/Android */}
          {!isInstalled && isInstallable && (
            <button
              onClick={onInstallPWA}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Pasang App</span>
            </button>
          )}

          {/* iOS Safari Install Button */}
          {!isInstalled && isIOS && (
            <button
              onClick={onOpenIOSGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/50 text-slate-300 hover:text-white text-xs font-medium transition active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Pasang di iPhone</span>
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition active:scale-95"
            aria-label="Buka Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
