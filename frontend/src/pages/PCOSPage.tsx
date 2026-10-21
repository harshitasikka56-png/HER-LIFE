import React, { useState, useEffect } from 'react';
import { UserProfile, PCOSRecord } from '../types';
import { api } from '../services/api';
import { HeartPulse, Plus, CheckCircle2, AlertTriangle, FileText, Download, ShieldAlert, Sparkles } from 'lucide-react';

interface PCOSPageProps {
  currentUser: UserProfile;
}

export const PCOSPage: React.FC<PCOSPageProps> = ({ currentUser }) => {
  const [logs, setLogs] = useState<PCOSRecord[]>([]);
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    acne_severity_0_3: 1,
    hirsutism_severity_0_3: 0,
    hair_thinning_severity_0_3: 0,
    weight_change_notes: '',
    skin_darkening_acanthosis: false,
    clinician_confirmed_pcos: false,
    clinician_notes: ''
  });

  useEffect(() => {
    loadData();
  }, [currentUser]);

  async function loadData() {
    setLoading(true);
    try {
      const [records, prep] = await Promise.all([
        api.getPCOSRecords(currentUser.id),
        api.getPCOSChecklist(currentUser.id)
      ]);
      setLogs(records);
      setChecklist(prep);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.addPCOSRecord(currentUser.id, form);
      setShowLogModal(false);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const SEVERITY_NAMES = ['None', 'Mild', 'Moderate', 'Severe'];

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold uppercase tracking-wider">
            <HeartPulse className="w-4 h-4" />
            <span>PCOS Awareness Center</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-warm-textDark mt-1">
            Symptom Pattern Monitoring & Clinical Preparation
          </h2>
          <p className="text-xs text-warm-textMuted mt-1">
            Monitor and record signs that may warrant clinical evaluation by a gynecologist or endocrinologist.
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-soft transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log PCOS-Related Symptoms</span>
        </button>
      </div>

      {/* Mandatory Non-Diagnostic Medical Safety Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200/70 p-4 rounded-3xl text-xs text-amber-950 flex items-start gap-3 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Medical Safety & Non-Diagnostic Notice:</strong>
          <p className="mt-1">
            HER LIFE does <strong>NOT</strong> diagnose Polycystic Ovary Syndrome (PCOS) or calculate purported diagnostic probabilities. 
            PCOS signs overlap with other conditions (such as thyroid disorders or congenital adrenal hyperplasia). 
            Furthermore, adolescent cycle irregularity and multifollicular ovaries are normal aspects of pubertal development. 
            A valid diagnosis requires clinical evaluation, hormone panels, and ultrasound interpretation by a licensed physician.
          </p>
        </div>
      </div>

      {/* Checklist & Questions for Gynecologist */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-warm-textDark">Appointment Discussion Checklist</h3>
              <p className="text-xs text-warm-textMuted">Bring these tailored evidence-grounded questions to your doctor</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-warm-border hover:bg-warm-cardMuted text-warm-textDark transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / Save Checklist</span>
          </button>
        </div>

        <div className="space-y-2 mt-2">
          {checklist?.questions_for_gynecologist?.map((q: string, idx: number) => (
            <div key={idx} className="p-3 bg-warm-cardMuted/50 rounded-2xl border border-warm-border/60 flex items-start gap-2.5 text-xs text-warm-textDark">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logged PCOS History */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <h3 className="text-base font-bold text-warm-textDark">Logged Symptom Records</h3>
        {logs.length === 0 ? (
          <p className="text-xs text-warm-textMuted">No PCOS-related symptom checks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-warm-border text-warm-textMuted font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Acne</th>
                  <th className="py-2.5 px-3">Hirsutism</th>
                  <th className="py-2.5 px-3">Hair Thinning</th>
                  <th className="py-2.5 px-3">Clinician Confirmed</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border/60">
                {logs.map((item) => (
                  <tr key={item.id} className="hover:bg-warm-cardMuted/40">
                    <td className="py-3 px-3 font-semibold text-warm-textDark">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-3">{SEVERITY_NAMES[item.acne_severity_0_3]}</td>
                    <td className="py-3 px-3">{SEVERITY_NAMES[item.hirsutism_severity_0_3]}</td>
                    <td className="py-3 px-3">{SEVERITY_NAMES[item.hair_thinning_severity_0_3]}</td>
                    <td className="py-3 px-3">
                      {item.clinician_confirmed_pcos ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                          Yes (Clinician Confirmed)
                        </span>
                      ) : (
                        <span className="text-warm-textMuted text-[11px]">Unconfirmed</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-warm-textMuted max-w-xs truncate">
                      {item.clinician_notes || item.weight_change_notes || '—'}
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-warm-border shadow-soft-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-warm-textDark font-serif">Record PCOS-Related Symptoms</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Persistent Acne Severity</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setForm({ ...form, acne_severity_0_3: lvl })}
                      className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                        form.acne_severity_0_3 === lvl ? 'bg-brand-500 text-white' : 'bg-warm-cardMuted text-warm-textDark'
                      }`}
                    >
                      {SEVERITY_NAMES[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Unwanted Hair Growth (Hirsutism)</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setForm({ ...form, hirsutism_severity_0_3: lvl })}
                      className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                        form.hirsutism_severity_0_3 === lvl ? 'bg-brand-500 text-white' : 'bg-warm-cardMuted text-warm-textDark'
                      }`}
                    >
                      {SEVERITY_NAMES[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Scalp Hair Thinning</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setForm({ ...form, hair_thinning_severity_0_3: lvl })}
                      className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                        form.hair_thinning_severity_0_3 === lvl ? 'bg-brand-500 text-white' : 'bg-warm-cardMuted text-warm-textDark'
                      }`}
                    >
                      {SEVERITY_NAMES[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-textDark mb-1">Weight Changes / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Unexplained weight gain, difficulty losing weight..."
                  value={form.weight_change_notes}
                  onChange={(e) => setForm({ ...form, weight_change_notes: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="clinician_confirmed"
                  checked={form.clinician_confirmed_pcos}
                  onChange={(e) => setForm({ ...form, clinician_confirmed_pcos: e.target.checked })}
                  className="rounded text-brand-500 focus:ring-brand-400"
                />
                <label htmlFor="clinician_confirmed" className="text-xs font-medium text-warm-textDark">
                  Clinician-confirmed diagnosis provided by a licensed physician
                </label>
              </div>

              {form.clinician_confirmed_pcos && (
                <div>
                  <label className="block text-xs font-semibold text-warm-textDark mb-1">Clinician Notes / Plan</label>
                  <textarea
                    rows={2}
                    placeholder="Physician notes, ultrasound findings, prescribed therapies..."
                    value={form.clinician_notes}
                    onChange={(e) => setForm({ ...form, clinician_notes: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-warm-border">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-warm-textMuted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold bg-brand-500 text-white rounded-xl shadow-soft hover:bg-brand-600 transition"
                >
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
