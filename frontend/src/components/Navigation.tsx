import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  HeartPulse, 
  Activity, 
  Sparkles, 
  Bot, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'calendar' 
  | 'checkin' 
  | 'pcos' 
  | 'stress' 
  | 'lifestages' 
  | 'aiguide' 
  | 'reports' 
  | 'privacy';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar & Cycles', icon: Calendar },
  { id: 'checkin', label: 'Daily Check-In', icon: PlusCircle },
  { id: 'pcos', label: 'PCOS Center', icon: HeartPulse },
  { id: 'stress', label: 'Stress & Hormones', icon: Activity },
  { id: 'lifestages', label: 'Life Stages', icon: Sparkles },
  { id: 'aiguide', label: 'AI Guide', icon: Bot },
  { id: 'reports', label: 'Health Timeline', icon: FileText },
  { id: 'privacy', label: 'Privacy & Safety', icon: ShieldCheck },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-b border-warm-border sticky top-[57px] sm:top-[65px] z-30 shadow-xs">
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
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
