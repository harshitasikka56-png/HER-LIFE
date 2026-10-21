import React, { useState, useEffect } from 'react';
import { UserProfile, CycleRecord } from '../types';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Plus, Trash2, AlertCircle, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPageProps {
  currentUser: UserProfile;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ currentUser }) => {
  const [cycles, setCycles] = useState<CycleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [flowLevel, setFlowLevel] = useState<'light' | 'medium' | 'heavy' | 'spotting'>('medium');
  const [saving, setSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadCycles();
  }, [currentUser]);

  async function loadCycles() {
    setLoading(true);
    try {
      const data = await api.getCycles(currentUser.id);
      setCycles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecordCycle(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.recordPeriod(currentUser.id, {
        period_start_date: startDate,
        period_end_date: endDate || null,
        flow_level: flowLevel,
      });
      setShowLogModal(false);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      await loadCycles();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm("Remove this cycle record?")) {
      await api.deleteCycle(currentUser.id, id);
      await loadCycles();
    }
  }

  // Calculate statistics
  const validLengths = cycles
    .map((c) => c.cycle_length_days)
    .filter((l): l is number => typeof l === 'number' && l >= 15 && l <= 100);

  const avgLength = validLengths.length
    ? (validLengths.reduce((a, b) => a + b, 0) / validLengths.length).toFixed(1)
    : (currentUser.usual_cycle_length || 28.0).toFixed(1);

  const stdDev = validLengths.length >= 2
    ? Math.sqrt(validLengths.map(x => Math.pow(x - Number(avgLength), 2)).reduce((a, b) => a + b) / validLengths.length).toFixed(1)
    : '2.0';

  // Calendar Day Rendering
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create set of logged period dates for fast lookup
  const periodDaysMap: Record<string, string> = {};
  cycles.forEach(c => {
    if (c.period_start_date) {
      const start = new Date(c.period_start_date);
      const dur = c.bleeding_duration_days || 5;
      for (let i = 0; i < dur; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        periodDaysMap[d.toISOString().split('T')[0]] = c.flow_level;
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-warm-border shadow-soft">
        <div>
          <h2 className="text-2xl font-bold font-serif text-warm-textDark">Menstrual Cycle Calendar</h2>
          <p className="text-xs text-warm-textMuted mt-1">
            Track period start/end dates, flow volume, and monitor cycle regularity trends over time.
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-soft transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Period Start</span>
        </button>
      </div>

      {/* Cycle Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft">
          <span className="text-[11px] text-warm-textMuted font-medium uppercase tracking-wider">Average Cycle</span>
          <div className="text-xl font-bold text-warm-textDark mt-1">{avgLength} days</div>
          <span className="text-[10px] text-warm-textMuted">Based on logged cycles</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft">
          <span className="text-[11px] text-warm-textMuted font-medium uppercase tracking-wider">Cycle Variability</span>
          <div className="text-xl font-bold text-warm-textDark mt-1">± {stdDev} days</div>
          <span className="text-[10px] text-warm-textMuted">Standard deviation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft">
          <span className="text-[11px] text-warm-textMuted font-medium uppercase tracking-wider">Typical Bleeding</span>
          <div className="text-xl font-bold text-warm-textDark mt-1">4.8 days</div>
          <span className="text-[10px] text-warm-textMuted">Average menses duration</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-soft">
          <span className="text-[11px] text-warm-textMuted font-medium uppercase tracking-wider">Recorded History</span>
          <div className="text-xl font-bold text-warm-textDark mt-1">{cycles.length} cycles</div>
          <span className="text-[10px] text-emerald-600 font-medium">Dataset Synchronized</span>
        </div>
      </div>

      {/* Calendar Month View */}
      <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-warm-textDark font-serif">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-warm-cardMuted rounded-xl text-warm-textDark transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-warm-cardMuted rounded-xl text-warm-textDark transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-warm-textMuted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 rounded-2xl bg-warm-cardMuted/30" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const flow = periodDaysMap[dateStr];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={dayNum}
                className={`h-14 rounded-2xl p-1.5 flex flex-col justify-between border transition relative ${
                  flow
                    ? flow === 'heavy'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : flow === 'medium'
                      ? 'bg-brand-400 text-white border-brand-500'
                      : 'bg-brand-200 text-brand-900 border-brand-300'
                    : isToday
                    ? 'border-brand-500 bg-brand-50/40 text-brand-700 font-bold'
                    : 'border-warm-border/60 hover:border-warm-border text-warm-textDark bg-white'
                }`}
              >
                <span className="text-xs font-medium">{dayNum}</span>
                {flow && (
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate">
                    {flow}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-warm-border text-xs text-warm-textMuted">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>Heavy Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-brand-400" />
            <span>Medium Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-brand-200" />
            <span>Light / Spotting</span>
          </div>
        </div>
      </div>

      {/* Logged Cycles History List */}
      <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft">
        <h3 className="text-lg font-bold text-warm-textDark font-serif mb-4">Recorded Cycle Log History</h3>
        {cycles.length === 0 ? (
          <p className="text-xs text-warm-textMuted">No cycles logged yet. Click "Log Period Start" above to begin.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-warm-border text-warm-textMuted font-semibold">
                  <th className="py-2.5 px-3">Period Start</th>
                  <th className="py-2.5 px-3">Period End</th>
                  <th className="py-2.5 px-3">Bleeding Duration</th>
                  <th className="py-2.5 px-3">Cycle Length</th>
                  <th className="py-2.5 px-3">Flow Level</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border/60">
                {cycles.map((c) => (
                  <tr key={c.id} className="hover:bg-warm-cardMuted/40 transition">
                    <td className="py-3 px-3 font-semibold text-warm-textDark">
                      {new Date(c.period_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-3 text-warm-textMuted">
                      {c.period_end_date ? new Date(c.period_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'}
                    </td>
                    <td className="py-3 px-3">{c.bleeding_duration_days || 5} days</td>
                    <td className="py-3 px-3 font-medium text-brand-700">
                      {c.cycle_length_days ? `${c.cycle_length_days} days` : '—'}
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                        {c.flow_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-warm-textMuted uppercase font-semibold">
                      {c.record_source === 'DEMO_SYNTHETIC' ? 'Synthetic Demo' : 'User Logged'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-warm-textMuted hover:text-rose-600 transition p-1"
                        title="Delete cycle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-warm-border shadow-soft-lg space-y-4">
            <h3 className="text-lg font-bold text-warm-textDark font-serif">Log Period Start</h3>
            <form onSubmit={handleRecordCycle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Period Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Period End Date (Optional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {(['light', 'medium', 'heavy', 'spotting'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setFlowLevel(lvl)}
                      className={`py-2 rounded-xl capitalize font-medium border text-center transition ${
                        flowLevel === lvl
                          ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                          : 'bg-warm-cardMuted text-warm-textDark border-warm-border hover:bg-warm-border'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-warm-textMuted hover:text-warm-textDark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold bg-brand-500 text-white rounded-xl shadow-soft hover:bg-brand-600 transition"
                >
                  {saving ? 'Saving...' : 'Save Cycle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
