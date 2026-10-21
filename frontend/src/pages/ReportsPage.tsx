import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { FileText, Download, Printer, ShieldAlert, Sparkles, Calendar, Activity } from 'lucide-react';

interface ReportsPageProps {
  currentUser: UserProfile;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ currentUser }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getLongitudinalReport(currentUser.id);
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  function handleExportCSV() {
    window.open(api.getExportCSVUrl(currentUser.id), '_blank');
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-xs text-warm-textMuted">
        Compiling longitudinal health timeline...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Longitudinal Health Timeline</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-warm-textDark mt-1">
            Clinical Summary & Appointment Report
          </h2>
          <p className="text-xs text-warm-textMuted mt-1">
            Multi-cycle synthesis combining recorded bleeding, symptom frequencies, and lifestyle patterns.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-warm-border hover:bg-warm-cardMuted text-warm-textDark transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-soft transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Non-causality disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200/70 p-4 rounded-3xl text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Medical Disclaimer:</strong>
          <p className="mt-1">
            Statistical co-occurrences between stress, sleep, and symptoms reflect recorded patterns and are <strong>NOT proof of medical causation</strong>. 
            This longitudinal report is formatted to assist you in productive, informed consultations with your gynecologist or primary care physician.
          </p>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-warm-textMuted font-medium">Patient / User</span>
          <div className="font-bold text-warm-textDark text-sm mt-0.5">{currentUser.full_name}</div>
        </div>
        <div>
          <span className="text-warm-textMuted font-medium">Age & Life Stage</span>
          <div className="font-bold text-warm-textDark text-sm mt-0.5">
            {currentUser.age_years} yrs • {currentUser.life_stage.replace('_', ' ')}
          </div>
        </div>
        <div>
          <span className="text-warm-textMuted font-medium">Cycles Analyzed</span>
          <div className="font-bold text-warm-textDark text-sm mt-0.5">{report?.cycles_recorded_count || 5} cycles</div>
        </div>
        <div>
          <span className="text-warm-textMuted font-medium">Report Date</span>
          <div className="font-bold text-warm-textDark text-sm mt-0.5">{report?.report_generated_date}</div>
        </div>
      </div>

      {/* Top Reported Symptoms Frequency */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-4">
        <h3 className="text-base font-bold text-warm-textDark font-serif">Symptom Recurrence Frequencies (Last 60 Days)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {report?.symptom_frequency_last_60_days &&
            Object.entries(report.symptom_frequency_last_60_days).map(([sym, count]: [string, any]) => (
              <div key={sym} className="p-3 bg-warm-cardMuted/50 rounded-2xl border border-warm-border/60">
                <span className="text-[11px] font-semibold text-warm-textMuted capitalize">
                  {sym.replace('_', ' ')}
                </span>
                <div className="text-lg font-bold text-warm-textDark mt-0.5 font-mono">{count} days reported</div>
              </div>
            ))}
        </div>
      </div>

      {/* Recommended Topics for Clinician Discussion */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft space-y-3">
        <h3 className="text-base font-bold text-warm-textDark font-serif">Suggested Topics to Review with Your Doctor</h3>
        <ul className="space-y-2 text-xs text-warm-textDark">
          {report?.discussion_points_for_doctor?.map((pt: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 bg-brand-50/40 rounded-xl border border-brand-100">
              <span className="w-4 h-4 rounded-full bg-brand-200 text-brand-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
