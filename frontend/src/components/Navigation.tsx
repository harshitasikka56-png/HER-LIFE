import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag,
  Activity,
  Calendar, 
  PlusCircle, 
  HeartPulse, 
  Flower2, 
  BookOpen,
  Bot, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';
import { Language, translations } from '../services/i18n';

export type NavTab = 
  | 'dashboard' 
  | 'hercare'
  | 'hermove'
  | 'calendar' 
  | 'checkin' 
  | 'pcos' 
  | 'stress' 
  | 'lifestages' 
  | 'firstperiod'
  | 'aiguide' 
  | 'reports' 
  | 'privacy';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, language }) => {
  const t = translations[language].nav;

  const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'hercare', label: t.hercare, icon: ShoppingBag, badge: 'Care' },
    { id: 'hermove', label: t.hermove, icon: Activity, badge: 'Fitness' },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'checkin', label: t.checkin, icon: PlusCircle },
    { id: 'pcos', label: t.pcos, icon: HeartPulse },
    { id: 'lifestages', label: t.lifestages, icon: Flower2 },
    { id: 'firstperiod', label: t.firstperiod, icon: BookOpen },
    { id: 'aiguide', label: t.aiguide, icon: Bot },
    { id: 'reports', label: t.reports, icon: FileText },
    { id: 'privacy', label: t.privacy, icon: ShieldCheck },
  ];

  return (
    <nav className="hidden md:block bg-white border-b border-warm-border sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-soft font-bold'
                    : 'text-warm-textMuted hover:text-warm-textDark hover:bg-warm-cardMuted'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-warm-textMuted'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
