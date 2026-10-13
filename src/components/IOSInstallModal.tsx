import React from 'react';
import { Share, PlusSquare, X, Smartphone, Check } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Pasang di iPhone / iPad</h3>
              <p className="text-xs text-slate-400">Jalankan layaknya aplikasi native tanpa browser bar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-200">
                Buka di <span className="text-emerald-400 font-semibold">Safari</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Pastikan Anda membuka website ini menggunakan browser Safari di iPhone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <span>Ketuk tombol</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-xs font-semibold">
                  <Share className="w-3.5 h-3.5" /> Share
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ikon kotak dengan panah ke atas di bagian bilah bawah Safari.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <span>Pilih</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-xs font-semibold">
                  <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                (Atau <em>Tambahkan ke Layar Utama</em>), lalu ketuk <strong>Tambah</strong> di pojok kanan atas.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-medium text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
