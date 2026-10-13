import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  BarChart2, 
  Activity 
} from 'lucide-react';
import { HistoryPoint } from '../types';
import { generateMonthlyHistory, calculateMonthlyStats } from '../utils/historyHelper';

interface MonthlyProgressProps {
  history?: Record<string, { completedCount: number; totalCount: number }>;
  currentCompletedCount: number;
  currentTotalCount: number;
  currentStreak: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: HistoryPoint;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: HistoryPoint = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-700/80 bg-[#0F172A]/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[150px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-semibold text-slate-200">
            {data.shortDate} {data.isToday && <span className="text-emerald-400 font-bold">(Hari ini)</span>}
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {data.completionRate}%
          </span>
        </div>
        <div className="text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Amalan Selesai:</span>
            <span className="font-mono text-white font-medium">
              {data.completedCount} / {data.totalCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Streak Berjalan:</span>
            <span className="font-mono text-amber-400 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-400 inline" />
              {data.streak} hari
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const MonthlyProgress: React.FC<MonthlyProgressProps> = ({
  history = {},
  currentCompletedCount,
  currentTotalCount,
  currentStreak,
}) => {
  const [viewType, setViewType] = useState<'rate' | 'counts'>('rate');

  const historyPoints = useMemo(() => {
    return generateMonthlyHistory(
      history,
      currentCompletedCount,
      currentTotalCount,
      currentStreak
    );
  }, [history, currentCompletedCount, currentTotalCount, currentStreak]);

  const stats = useMemo(() => {
    return calculateMonthlyStats(historyPoints);
  }, [historyPoints]);

  return (
    <section className="space-y-4 pt-2">
      {/* Container Card */}
      <div className="rounded-3xl border border-slate-800/90 bg-[#0E1524]/70 p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Progres 30 Hari Terakhir
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Konsistensi amalan refleksi harian & tingkat pemenuhan
            </p>
          </div>

          {/* Interactive Chart Mode Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewType('rate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                viewType === 'rate'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Persentase (%)</span>
            </button>
            <button
              onClick={() => setViewType('counts')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                viewType === 'counts'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Amalan & Streak</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
          {/* Average Completion */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Rata-rata 30 Hari</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
              {stats.averageRate}%
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium">
              Tingkat penyelesaian
            </span>
          </div>

          {/* Perfect Days */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Hari Sempurna</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-white tabular-nums">
              {stats.perfectDays} <span className="text-xs font-sans text-slate-400 font-normal">hari</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              100% amalan tuntas
            </span>
          </div>

          {/* Current Streak */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">Streak Saat Ini</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {currentStreak} <span className="text-xs font-sans text-slate-400 font-normal">hari</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Konsistensi beruntun
            </span>
          </div>
        </div>

        {/* Recharts Visualization Container */}
        <div className="w-full h-56 sm:h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'rate' ? (
              <AreaChart
                data={historyPoints}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCompletion" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  interval={4}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickFormatter={(val) => `${val}%`}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completionRate"
                  name="Tingkat Penyelesaian"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCompletion)"
                  activeDot={{
                    r: 5,
                    fill: '#10B981',
                    stroke: '#0F172A',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            ) : (
              <ComposedChart
                data={historyPoints}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="shortDate"
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  interval={4}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 6]}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  ticks={[0, 2, 4, 6]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 30]}
                  hide
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="completedCount"
                  name="Amalan Selesai"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="streak"
                  name="Streak"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#F59E0B' }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Bottom Legend & Reflective Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-400">Penyelesaian (%)</span>
            </div>
            {viewType === 'counts' && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-400">Streak (Garis Kuning)</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>Merekam jejak kebaikan Anda menuju usia 40 tahun</span>
          </div>
        </div>
      </div>
    </section>
  );
};
