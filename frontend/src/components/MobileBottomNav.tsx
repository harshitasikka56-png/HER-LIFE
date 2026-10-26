import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag,
  Activity,
  Calendar, 
  Plus, 
  Bot, 
  Grid, 
  X, 
  HeartPulse, 
  Flower2, 
  BookOpen, 
  FileText, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { NavTab } from './Navigation';
import { Language, translations } from '../services/i18n';
import { useBackHandler } from '../services/backNavigation';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  language
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const t = translations[language].nav;

  // Close more menu sheet on Android back
  useBackHandler(
    'mobile_bottom_nav_more_sheet',
    80,
    () => {
      if (showMoreSheet) {
        setShowMoreSheet(false);
        return true;
      }
      return false;
    },
    showMoreSheet
  );

  const MORE_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; desc: string; color: string }[] = [
    { id: 'hermove', label: 'HER MOVE', icon: Activity, desc: 'Personalized fitness & healthy lifestyle routines', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'aiguide', label: t.aiguide, icon: Bot, desc: 'Private AI health companion & empathetic advice', color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { id: 'pcos', label: t.pcos, icon: HeartPulse, desc: 'Symptom pattern monitoring without clinical bias', color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { id: 'lifestages', label: t.lifestages, icon: Flower2, desc: 'Puberty to menopause transitional care', color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { id: 'firstperiod', label: t.firstperiod, icon: BookOpen, desc: 'Gentle youth guide for first cycle confidence', color: 'text-pink-600 bg-pink-50 border-pink-100' },
    { id: 'reports', label: t.reports, icon: FileText, desc: 'Health summary timeline for appointments', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { id: 'privacy', label: t.privacy, icon: ShieldCheck, desc: 'Data protection and discrete mode controls', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  function handleSelectTab(tab: NavTab) {
    onTabChange(tab);
    setShowMoreSheet(false);
  }

  const isMoreActive = ['hermove', 'aiguide', 'pcos', 'lifestages', 'firstperiod', 'reports', 'privacy'].includes(activeTab);

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on screens < md) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-warm-border shadow-lg px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around h-15 max-w-lg mx-auto">
          {/* 1. Today / Dashboard */}
          <button
            type="button"
            onClick={() => handleSelectTab('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all touch-target ${
              activeTab === 'dashboard'
                ? 'text-brand-600 font-bold scale-105'
                : 'text-warm-textMuted hover:text-warm-textDark'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {t.dashboard}
            </span>
          </button>

          {/* 2. HER CARE Dedicated Marketplace Tab */}
          <button
            type="button"
            onClick={() => handleSelectTab('hercare')}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all touch-target relative ${
              activeTab === 'hercare'
                ? 'text-brand-600 font-bold scale-105'
                : 'text-warm-textMuted hover:text-warm-textDark'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-5 h-5 ${activeTab === 'hercare' ? 'stroke-[2.5]' : ''}`} />
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              HER CARE
            </span>
          </button>

          {/* 3. Center Elevated Quick Log (+) Button */}
          <div className="flex-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => handleSelectTab('checkin')}
              aria-label="Log Daily Symptoms"
              className={`relative -top-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform active:scale-95 ${
                activeTab === 'checkin'
                  ? 'bg-gradient-to-tr from-brand-600 via-rose-500 to-amber-500 text-white ring-4 ring-rose-200/80 scale-105'
                  : 'bg-gradient-to-tr from-brand-500 via-rose-400 to-amber-400 text-white hover:scale-105'
              }`}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* 4. Calendar */}
          <button
            type="button"
            onClick={() => handleSelectTab('calendar')}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all touch-target ${
              activeTab === 'calendar'
                ? 'text-brand-600 font-bold scale-105'
                : 'text-warm-textMuted hover:text-warm-textDark'
            }`}
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {t.calendar}
            </span>
          </button>

          {/* 5. Health Hub / More */}
          <button
            type="button"
            onClick={() => setShowMoreSheet(true)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all touch-target ${
              isMoreActive
                ? 'text-brand-600 font-bold scale-105'
                : 'text-warm-textMuted hover:text-warm-textDark'
            }`}
          >
            <Grid className={`w-5 h-5 ${isMoreActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              Hub
            </span>
          </button>
        </div>
      </nav>

      {/* More Health Hub Bottom Sheet Drawer */}
      {showMoreSheet && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          {/* Backdrop dismiss */}
          <div className="flex-1" onClick={() => setShowMoreSheet(false)} />

          <div className="bg-white rounded-t-[32px] p-5 border-t border-warm-border shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-warm-border rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b border-warm-border">
              <div>
                <h3 className="font-serif font-bold text-lg text-warm-textDark">HerLife Health Hub</h3>
                <p className="text-xs text-warm-textMuted">Explore all clinical features & life-stage settings</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreSheet(false)}
                className="p-2 rounded-full hover:bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Featured HER CARE Marketplace Banner */}
            <button
              type="button"
              onClick={() => handleSelectTab('hercare')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-brand-500 to-amber-500 text-white text-left flex items-center justify-between gap-3 shadow-soft transition transform active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs">HER CARE Marketplace</h4>
                    <span className="text-[9px] bg-white/30 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">10-Min Delivery</span>
                  </div>
                  <p className="text-[11px] text-white/90">Pads, hot water bags, dark chocolate & pamper kits</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/90 shrink-0" />
            </button>

            {/* Hub Items Grid */}
            <div className="space-y-2">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-400 shadow-soft'
                        : 'bg-white hover:bg-warm-cardMuted border-warm-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-warm-textDark">{item.label}</h4>
                        <p className="text-[11px] text-warm-textMuted line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-warm-textMuted shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
