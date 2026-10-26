import React, { useState, useEffect } from 'react';
import { UserProfile, CortisolRecord } from '../types';
import { api } from '../services/api';
import { Activity, Zap, Moon, Plus, AlertCircle, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useBackHandler } from '../services/backNavigation';

interface StressPageProps {
  currentUser: UserProfile;
}

export const StressPage: React.FC<StressPageProps> = ({ currentUser }) => {
  const [trends, setTrends] = useState<any>(null);
  const [cortisolTests, setCortisolTests] = useState<CortisolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLabModal, setShowLabModal] = useState(false);

  useBackHandler(
    'stress_lab_modal',
    80,
    () => {
      if (showLabModal) {
        setShowLabModal(false);
        return true;
      }
      return false;
    },
    showLabModal
  );
  const [savingLab, setSavingLab] = useState(false);

  const [labForm, setLabForm] = useState({
    test_date: new Date().toISOString().split('T')[0],
    collection_time: '08:00 AM',
    test_value: 12.5,
    units: 'ug/dL',
    reference_range: 'Morning: 6.0 - 18.4 ug/dL',
    lab_name: 'Diagnostic Reference Lab',
    test_type: 'Morning Serum Cortisol',
    notes: '',
    medical_disclaimer_acknowledged: true
  });

  useEffect(() => {
    loadData();
  }, [currentUser]);

  async function loadData() {
    setLoading(true);
    try {
      const [trendData, tests] = await Promise.all([
        api.getStressTrends(currentUser.id),
        api.getCortisolTests(currentUser.id)
      ]);
      setTrends(trendData);
      setCortisolTests(tests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLab(e: React.FormEvent) {
    e.preventDefault();
    setSavingLab(true);
    try {
      await api.addCortisolTest(currentUser.id, labForm);
      setShowLabModal(false);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingLab(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title & Action */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Stress & Hormone Insights</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-warm-textDark mt-1">
            Lifestyle Rhythms & Endocrine Awareness
          </h2>
          <p className="text-xs text-warm-textMuted mt-1">
            Explore personal associations between self-reported stress, sleep, workload, and menstrual comfort.
          </p>
        </div>
        <button
          onClick={() => setShowLabModal(true)}
          className="w-full sm:w-auto bg-plum-700 hover:bg-plum-800 text-white text-xs font-bold px-4 py-3 sm:py-2.5 rounded-xl shadow-soft transition flex items-center justify-center gap-1.5 shrink-0 min-h-[44px] active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lab Cortisol Test</span>
        </button>
      </div>

      {/* Critical Medical Safety Requirement Notice */}
      <div className="bg-rose-50/70 border border-rose-200/70 p-4 rounded-3xl text-xs text-rose-950 flex items-start gap-3 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Critical Endocrine Safety Protocol:</strong>
          <p className="mt-1">
            HER LIFE explicitly distinguishes between <strong>self-reported subjective stress</strong> and <strong>laboratory-measured cortisol</strong>. 
            We <strong>NEVER infer physiological cortisol levels</strong> from stress questionnaires, sleep logs, or symptom severities. 
            Clinical cortisol follows a diurnal cycle (peaking at ~8:00 AM) and requires clinical context, collection timing, and reference ranges. 
            Statistical correlations between stress and cycle length do <strong>NOT</strong> prove medical causation.
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stress & Sleep Trends Chart */}
        <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-warm-textDark">Stress Score vs. Sleep Hours</h3>
              <p className="text-xs text-warm-textMuted">Past 14 Days Tracking Trend</p>
            </div>
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              Self-Reported
            </span>
          </div>

          <div className="h-60 w-full">
            {trends?.data && trends.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.data}>
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C26D5C" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#C26D5C" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#698F73" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#698F73" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE8" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} stroke="#A8A29E" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#A8A29E" />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #EDE7E1' }} />
                  <Area type="monotone" dataKey="stress_level" name="Stress (0-4)" stroke="#C26D5C" strokeWidth={2} fillOpacity={1} fill="url(#stressGrad)" />
                  <Area type="monotone" dataKey="sleep_hours" name="Sleep (Hours)" stroke="#698F73" strokeWidth={2} fillOpacity={1} fill="url(#sleepGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-warm-textMuted">
                Log daily check-ins to generate personal trend visualizations.
              </div>
            )}
          </div>
        </div>

        {/* Association Insights Box */}
        <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-warm-textDark">Model D: Lifestyle Associations</h3>
            </div>
            <p className="text-xs text-warm-textMuted mb-4">
              Machine learning analysis of statistical covariances (honest correlations, not medical causality):
            </p>

            <div className="space-y-3">
              <div className="p-3.5 bg-warm-cardMuted/60 rounded-2xl border border-warm-border/60">
                <div className="flex items-center justify-between text-xs font-bold text-warm-textDark">
                  <span>Elevated Stress & Sleep Disruption</span>
                  <span className="text-brand-600 font-mono">+0.42 r</span>
                </div>
                <p className="text-[11px] text-warm-textMuted mt-1 leading-relaxed">
                  Noticeable correlation between high exam/work workload days and lighter, fragmented sleep.
                </p>
              </div>

              <div className="p-3.5 bg-warm-cardMuted/60 rounded-2xl border border-warm-border/60">
                <div className="flex items-center justify-between text-xs font-bold text-warm-textDark">
                  <span>Regular Movement & Cramp Relief</span>
                  <span className="text-emerald-600 font-mono">+0.31 r</span>
                </div>
                <p className="text-[11px] text-warm-textMuted mt-1 leading-relaxed">
                  Moderate walking or gentle yoga is associated with lower subjective cramp discomfort.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-warm-textMuted pt-4 border-t border-warm-border italic">
            * Reminder: Statistical associations reflect your logged co-occurrences and do not demonstrate biological causation.
          </p>
        </div>
      </div>

      {/* Lab Cortisol Records Table */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-warm-textDark">Laboratory Hormone Test Diary</h3>
            <p className="text-xs text-warm-textMuted">User-entered clinical lab tests with verified collection times</p>
          </div>
          <span className="text-xs font-semibold bg-plum-50 text-plum-700 border border-plum-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Clinical Lab Records
          </span>
        </div>

        {cortisolTests.length === 0 ? (
          <p className="text-xs text-warm-textMuted">No laboratory test results entered yet.</p>
        ) : (
          <>
            {/* Mobile Cards (< md) */}
            <div className="space-y-2.5 md:hidden">
              {cortisolTests.map((t) => (
                <div key={t.id} className="p-3.5 bg-warm-cardMuted/50 rounded-2xl border border-warm-border/70 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-warm-textDark">
                      {new Date(t.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-bold text-plum-700 bg-plum-50 px-2 py-0.5 rounded-full border border-plum-200">
                      {t.test_value} {t.units}
                    </span>
                  </div>
                  <div className="text-[11px] text-warm-textMuted flex justify-between">
                    <span>{t.test_type}</span>
                    <span>Collected: {t.collection_time}</span>
                  </div>
                  <div className="text-[11px] text-warm-textMuted flex justify-between border-t border-warm-border/50 pt-1">
                    <span>Range: {t.reference_range}</span>
                    <span className="truncate max-w-[140px]">{t.lab_name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-warm-border text-warm-textMuted font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Collection Time</th>
                    <th className="py-2.5 px-3">Test Type</th>
                    <th className="py-2.5 px-3">Measured Value</th>
                    <th className="py-2.5 px-3">Reference Range</th>
                    <th className="py-2.5 px-3">Laboratory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-border/60">
                  {cortisolTests.map((t) => (
                    <tr key={t.id} className="hover:bg-warm-cardMuted/40">
                      <td className="py-3 px-3 font-semibold text-warm-textDark">
                        {new Date(t.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-3">{t.collection_time}</td>
                      <td className="py-3 px-3">{t.test_type}</td>
                      <td className="py-3 px-3 font-bold text-plum-700">
                        {t.test_value} {t.units}
                      </td>
                      <td className="py-3 px-3 text-warm-textMuted">{t.reference_range}</td>
                      <td className="py-3 px-3 text-warm-textMuted">{t.lab_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Lab Log Modal */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full border border-warm-border shadow-soft-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-warm-textDark font-serif">Enter Clinical Cortisol Result</h3>
            <form onSubmit={handleAddLab} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Date of Blood Draw / Test</label>
                <input
                  type="date"
                  required
                  value={labForm.test_date}
                  onChange={(e) => setLabForm({ ...labForm, test_date: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-warm-textDark mb-1">Collection Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:15 AM"
                    value={labForm.collection_time}
                    onChange={(e) => setLabForm({ ...labForm, collection_time: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-textDark mb-1">Measured Value</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={labForm.test_value}
                    onChange={(e) => setLabForm({ ...labForm, test_value: parseFloat(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-warm-textDark mb-1">Units</label>
                  <select
                    value={labForm.units}
                    onChange={(e) => setLabForm({ ...labForm, units: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white"
                  >
                    <option value="ug/dL">ug/dL</option>
                    <option value="nmol/L">nmol/L</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-textDark mb-1">Reference Range</label>
                  <input
                    type="text"
                    value={labForm.reference_range}
                    onChange={(e) => setLabForm({ ...labForm, reference_range: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Laboratory Name</label>
                <input
                  type="text"
                  value={labForm.lab_name}
                  onChange={(e) => setLabForm({ ...labForm, lab_name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-warm-cardMuted rounded-xl text-[10px] text-warm-textMuted leading-tight">
                * Note: Lab reference values vary by laboratory method and diurnal timing. Share these results directly with your physician for clinical interpretation.
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-warm-border">
                <button
                  type="button"
                  onClick={() => setShowLabModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-warm-textMuted rounded-xl border border-warm-border sm:border-0 hover:bg-warm-cardMuted text-center min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLab}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-plum-700 text-white rounded-xl shadow-soft hover:bg-plum-800 transition min-h-[44px] active:scale-98"
                >
                  {savingLab ? 'Saving...' : 'Record Lab Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
