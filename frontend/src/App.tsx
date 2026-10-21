import React, { useState, useEffect } from 'react';
import { UserProfile, LifeStage } from './types';
import { api, FALLBACK_DEMO_USERS } from './services/api';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { CheckInPage } from './pages/CheckInPage';
import { PCOSPage } from './pages/PCOSPage';
import { StressPage } from './pages/StressPage';
import { LifeStagesPage } from './pages/LifeStagesPage';
import { AIGuidePage } from './pages/AIGuidePage';
import { ReportsPage } from './pages/ReportsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { Heart, ShieldCheck } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(FALLBACK_DEMO_USERS[2]); // Priya (Reproductive) by default
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>(FALLBACK_DEMO_USERS);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [discreteMode, setDiscreteMode] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const users = await api.getDemoUsers();
        if (users && users.length > 0) {
          setDemoUsers(users);
          // Keep current user in sync
          const matched = users.find(u => u.id === currentUser.id) || users[2];
          setCurrentUser(matched);
        }
      } catch (e) {
        console.error("Init demo users error:", e);
      }
    }
    init();
  }, []);

  async function handleSelectUser(user: UserProfile) {
    try {
      const switched = await api.switchDemoUser(user.id);
      setCurrentUser(switched);
    } catch (e) {
      setCurrentUser(user);
    }
  }

  async function handleUpdateStage(stage: LifeStage) {
    try {
      const updated = await api.updateProfile(currentUser.id, { life_stage: stage });
      setCurrentUser(updated);
    } catch (e) {
      setCurrentUser({ ...currentUser, life_stage: stage });
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col font-sans text-warm-textDark antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* Header */}
      <Header
        currentUser={currentUser}
        demoUsers={demoUsers}
        onSelectUser={handleSelectUser}
        onUpdateStage={handleUpdateStage}
        discreteMode={discreteMode}
        onToggleDiscrete={() => setDiscreteMode(!discreteMode)}
      />

      {/* Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardPage currentUser={currentUser} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'calendar' && (
          <CalendarPage currentUser={currentUser} />
        )}
        {activeTab === 'checkin' && (
          <CheckInPage currentUser={currentUser} />
        )}
        {activeTab === 'pcos' && (
          <PCOSPage currentUser={currentUser} />
        )}
        {activeTab === 'stress' && (
          <StressPage currentUser={currentUser} />
        )}
        {activeTab === 'lifestages' && (
          <LifeStagesPage currentUser={currentUser} onUpdateStage={handleUpdateStage} />
        )}
        {activeTab === 'aiguide' && (
          <AIGuidePage currentUser={currentUser} />
        )}
        {activeTab === 'reports' && (
          <ReportsPage currentUser={currentUser} />
        )}
        {activeTab === 'privacy' && (
          <PrivacyPage
            currentUser={currentUser}
            discreteMode={discreteMode}
            onToggleDiscrete={() => setDiscreteMode(!discreteMode)}
          />
        )}
      </main>

      {/* Footer with Medical Safety Statement */}
      <footer className="bg-white border-t border-warm-border mt-12 py-8 text-xs text-warm-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="font-bold text-warm-textDark font-serif text-sm">HER LIFE</span>
              <span>— "Every Stage. Every Cycle. Every You."</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Privacy Safeguarded
              </span>
              <span>•</span>
              <span>FastAPI + PyTorch/scikit-learn + React + TypeScript</span>
            </div>
          </div>

          <div className="p-3.5 bg-warm-cardMuted/60 rounded-2xl border border-warm-border/60 text-[11px] leading-relaxed">
            <strong>Medical & Educational Disclaimer:</strong> HER LIFE is an AI-powered health tracking and educational platform. 
            Algorithm predictions, cycle estimates, and symptom trends are mathematical projections based on user-entered logs and do NOT constitute clinical diagnosis, medical treatment, or contraception. 
            Always consult a licensed healthcare professional for clinical concerns, severe pelvic pain, or irregular bleeding patterns.
          </div>

          <div className="text-center text-[11px] text-warm-textMuted pt-2">
            HER LIFE © 2026. Built with empathy, scientific rigor, and privacy-first engineering.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
