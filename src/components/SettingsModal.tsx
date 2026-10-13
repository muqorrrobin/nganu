import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Smartphone, 
  Database, 
  Plus, 
  Trash2, 
  ListChecks,
  ShieldCheck
} from 'lucide-react';
import { UserSettings, ReflectionItem } from '../types';
import { addYearsToDate, formatDateIndonesian } from '../utils/timeCalculations';

interface SettingsModalProps {
  isOpen: boolean;
  currentSettings: UserSettings;
  items: ReflectionItem[];
  onSave: (newSettings: UserSettings) => void;
  onUpdateItems: (newItems: ReflectionItem[]) => void;
  onResetItemsToDefault: () => void;
  onClose: () => void;
  onResetTodayChecklist: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentSettings,
  items,
  onSave,
  onUpdateItems,
  onResetItemsToDefault,
  onClose,
  onResetTodayChecklist,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'checklist'>('profile');
  const [userName, setUserName] = useState(currentSettings.userName);
  const [birthDate, setBirthDate] = useState(currentSettings.birthDate);
  const [targetDate, setTargetDate] = useState(currentSettings.targetDate);
  const [hapticsEnabled, setHapticsEnabled] = useState(currentSettings.hapticsEnabled);
  const [resetFeedback, setResetFeedback] = useState(false);

  // New question form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionSubtitle, setNewQuestionSubtitle] = useState('');
  const [newCategoryLabel, setNewCategoryLabel] = useState('Amalan Harian');

  useEffect(() => {
    if (isOpen) {
      setUserName(currentSettings.userName);
      setBirthDate(currentSettings.birthDate);
      setTargetDate(currentSettings.targetDate);
      setHapticsEnabled(currentSettings.hapticsEnabled);
      setResetFeedback(false);
      setNewQuestionText('');
      setNewQuestionSubtitle('');
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthDate(val);
    if (val) {
      const autoTarget = addYearsToDate(val, 40);
      setTargetDate(autoTarget);
    }
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      userName: userName.trim(),
      birthDate,
      targetDate: targetDate || addYearsToDate(birthDate, 40),
      hapticsEnabled,
    });
    onClose();
  };

  const handleManualReset = () => {
    if (window.confirm('Reset status checklist hari ini kembali ke kondisi kosong?')) {
      onResetTodayChecklist();
      setResetFeedback(true);
      setTimeout(() => setResetFeedback(false), 2000);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newItem: ReflectionItem = {
      id: `custom-${Date.now()}`,
      category: 'custom',
      categoryLabel: newCategoryLabel.trim() || 'Amalan Harian',
      question: newQuestionText.trim(),
      subtitle: newQuestionSubtitle.trim() || 'Evaluasi refleksi harian.',
      iconName: 'Sparkles',
    };

    onUpdateItems([...items, newItem]);
    setNewQuestionText('');
    setNewQuestionSubtitle('');
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      alert('Minimal harus ada satu butir refleksi.');
      return;
    }
    if (window.confirm('Hapus pertanyaan refleksi ini dari daftar harian?')) {
      onUpdateItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Pengaturan & Data</h3>
              <p className="text-xs text-slate-400">Kelola waktu, amalan refleksi, dan privasi</p>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Waktu & Profil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            Daftar Pertanyaan ({items.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmitProfile} id="profile-form" className="space-y-4">
              {/* Data Storage Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-emerald-400">
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Di Mana Data Anda Disimpan?</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Seluruh data tanggal lahir, checklist refleksi harian, dan streak Anda tersimpan langsung di <strong>memori lokal browser perangkat Anda (LocalStorage)</strong>.
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Privat, offline-ready, dan tidak dikirim ke server luar manapun.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nama / Panggilan
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Muchammad"
                  maxLength={40}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tanggal Lahir Anda
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition"
                />
                {birthDate && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Lahir: {formatDateIndonesian(birthDate)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Target Ulang Tahun ke-40
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">Auto-calculated</span>
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition"
                />
                {targetDate && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Target usia 40 tahun: <span className="text-emerald-400 font-medium">{formatDateIndonesian(targetDate)}</span>
                  </p>
                )}
              </div>

              {/* Haptic Feedback Toggle */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">Getaran Sentuh (Haptics)</p>
                      <p className="text-[11px] text-slate-400">Efek getaran halus saat mengetuk checklist di HP</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hapticsEnabled}
                    onChange={(e) => setHapticsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                </label>
              </div>

              {/* Manual Reset Checklist button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-200">Uji Reset Checklist</p>
                  <p className="text-[11px] text-slate-400">Otomatis reset jam 00:00, atau reset manual sekarang</p>
                </div>
                <button
                  type="button"
                  onClick={handleManualReset}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resetFeedback ? 'Direset!' : 'Reset'}
                </button>
              </div>
            </form>
          ) : (
            /* Checklist Management Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300 font-medium">Daftar Pertanyaan Refleksi ({items.length})</p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kembalikan seluruh daftar pertanyaan ke rekomendasi bawaan (Sedekah, Qur\'an, Sholat, dll)?')) {
                      onResetItemsToDefault();
                    }
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset ke Bawaan
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                          {idx + 1}. {item.categoryLabel}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">{item.question}</p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Hapus butir ini"
                      aria-label="Hapus butir ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Custom Question Form */}
              <form onSubmit={handleAddQuestion} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tambah Pertanyaan Refleksi Baru</span>
                </div>

                <div>
                  <input
                    type="text"
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    placeholder="Kategori (contoh: Sholat Sunnah / Olahraga)"
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Pertanyaan (contoh: Sudah sholat dhuha hari ini?)"
                    required
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={newQuestionSubtitle}
                    onChange={(e) => setNewQuestionSubtitle(e.target.value)}
                    placeholder="Keterangan singkat / pengingat (opsional)"
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newQuestionText.trim()}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-emerald-600 disabled:opacity-50 text-slate-200 hover:text-white text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambahkan ke Checklist Harian
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition"
          >
            Tutup
          </button>
          {activeTab === 'profile' && (
            <button
              type="submit"
              form="profile-form"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-medium shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
