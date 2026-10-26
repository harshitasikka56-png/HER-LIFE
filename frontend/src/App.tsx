import React, { useState, useEffect } from 'react';
import { UserProfile, LifeStage } from './types';
import { api, FALLBACK_DEMO_USERS } from './services/api';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { PreNotificationModal } from './components/PreNotificationModal';
import { NotificationToast } from './components/NotificationToast';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { CheckInPage } from './pages/CheckInPage';
import { PCOSPage } from './pages/PCOSPage';
import { StressPage } from './pages/StressPage';
import { LifeStagesPage } from './pages/LifeStagesPage';
import { AIGuidePage } from './pages/AIGuidePage';
import { ReportsPage } from './pages/ReportsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { HerCarePage } from './pages/HerCarePage';
import { HerMovePage } from './pages/HerMovePage';
import { FirstPeriodEducationSlide } from './components/FirstPeriodEducationSlide';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { DoctorArticlesModal } from './components/DoctorArticlesModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ThemeStudioModal } from './components/ThemeStudioModal';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { LandingPage } from './components/onboarding/LandingPage';
import { OnboardingWizard, OnboardingData } from './components/onboarding/OnboardingWizard';
import { WelcomeTransition } from './components/onboarding/WelcomeTransition';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Heart, ShieldCheck, Mic, Award, MessageSquareHeart } from 'lucide-react';
import { Language, translations } from './services/i18n';
import { initBackNavigation, useBackHandler, exitHerLifeApp } from './services/backNavigation';
import { ExitConfirmModal } from './components/common/ExitConfirmModal';

export type AppFlowState = 'splash' | 'landing' | 'onboarding' | 'welcome' | 'dashboard';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(FALLBACK_DEMO_USERS[2]); // Priya (Reproductive) by default
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>(FALLBACK_DEMO_USERS);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [discreteMode, setDiscreteMode] = useState(true);
  const [language, setLanguage] = useState<Language>('en'); // Clean, professional English by default
  const [showPreNotificationModal, setShowPreNotificationModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showDoctorArticlesModal, setShowDoctorArticlesModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // App Flow State: splash -> landing -> onboarding -> welcome -> dashboard
  const [appFlow, setAppFlow] = useState<AppFlowState>('splash');
  const [onboardingResult, setOnboardingResult] = useState<OnboardingData | null>(null);

  // Android Back Navigation History Stack & Exit Dialog
  const [tabHistory, setTabHistory] = useState<NavTab[]>(['dashboard']);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Initialize Android system back button listener and browser popstate
  useEffect(() => {
    const cleanup = initBackNavigation();
    return cleanup;
  }, []);

  function handleTabChange(tab: NavTab) {
    if (tab === activeTab) return;
    setTabHistory((prev) => {
      if (prev[prev.length - 1] === tab) return prev;
      return [...prev, tab];
    });
    setActiveTab(tab);
  }

  function handleAppBack(): boolean {
    if (appFlow !== 'dashboard') {
      if (appFlow === 'welcome') {
        setAppFlow('dashboard');
        return true;
      }
      if (appFlow === 'landing') {
        setShowExitConfirm(true);
        return true;
      }
      return false;
    }

    // Check if we can pop to previous tab in navigation history
    if (tabHistory.length > 1) {
      const nextHistory = [...tabHistory];
      nextHistory.pop();
      const prevTab = nextHistory[nextHistory.length - 1];
      setTabHistory(nextHistory);
      setActiveTab(prevTab);
      return true;
    }

    // If on a secondary tab but history is empty, return to root Dashboard
    if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
      setTabHistory(['dashboard']);
      return true;
    }

    // Root Dashboard reached: trigger native Exit Confirmation Dialog
    setShowExitConfirm(true);
    return true;
  }

  // Priority 100: Exit confirmation dialog dismissal
  useBackHandler(
    'app_exit_confirm',
    100,
    () => {
      if (showExitConfirm) {
        setShowExitConfirm(false);
        return true;
      }
      return false;
    },
    showExitConfirm
  );

  // Priority 85: Global Modal Dismissals on Back
  useBackHandler(
    'global_voice_modal',
    85,
    () => {
      if (showVoiceModal) {
        setShowVoiceModal(false);
        return true;
      }
      return false;
    },
    showVoiceModal
  );

  useBackHandler(
    'global_doctor_modal',
    85,
    () => {
      if (showDoctorArticlesModal) {
        setShowDoctorArticlesModal(false);
        return true;
      }
      return false;
    },
    showDoctorArticlesModal
  );

  useBackHandler(
    'global_feedback_modal',
    85,
    () => {
      if (showFeedbackModal) {
        setShowFeedbackModal(false);
        return true;
      }
      return false;
    },
    showFeedbackModal
  );

  useBackHandler(
    'global_theme_modal',
    85,
    () => {
      if (showThemeModal) {
        setShowThemeModal(false);
        return true;
      }
      return false;
    },
    showThemeModal
  );

  useBackHandler(
    'global_prenotif_modal',
    85,
    () => {
      if (showPreNotificationModal) {
        setShowPreNotificationModal(false);
        return true;
      }
      return false;
    },
    showPreNotificationModal
  );

  // Priority 30: Central App Back Handler
  useBackHandler(
    'app_main_navigation_back',
    30,
    () => handleAppBack(),
    appFlow === 'dashboard' || appFlow === 'landing' || appFlow === 'welcome'
  );

  const [toast, setToast] = useState<{ show: boolean; title: string; body: string }>({
    show: false,
    title: '',
    body: ''
  });

  useEffect(() => {
    async function init() {
      try {
        const users = await api.getDemoUsers();
        if (users && users.length > 0) {
          setDemoUsers(users);
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

  function handleTriggerToast(title: string, body: string) {
    setToast({ show: true, title, body });
  }

  function handleLogout() {
    setAppFlow('landing');
    setActiveTab('dashboard');
  }

  function handleOnboardingComplete(data: OnboardingData) {
    setOnboardingResult(data);
    let stage: LifeStage = 'reproductive';
    if (data.menstrualJourney === 'not_started' || data.age < 16) {
      stage = 'teen_menarche';
    } else if (data.generation === 'gen_z' || (data.age >= 17 && data.age <= 24)) {
      stage = 'college_gen_z';
    } else if (data.menstrualJourney === 'menopausal_transition') {
      stage = 'perimenopause';
    } else if (data.menstrualJourney === 'menopause' || data.age >= 50) {
      stage = 'menopause';
    }

    if (data.preferredLanguage) {
      setLanguage(data.preferredLanguage);
    }

    const durationDaysNum = data.usualBleedingDurationDays === '1-2' ? 2 :
      data.usualBleedingDurationDays === '>7' ? 8 :
      parseInt(data.usualBleedingDurationDays || '5', 10) || 5;

    const newUser: UserProfile = {
      id: `custom_user_${Date.now()}`,
      email: `${data.preferredName.toLowerCase().replace(/\s+/g, '')}@herlife.app`,
      full_name: data.preferredName,
      age_years: data.age,
      life_stage: stage,
      cycle_regularity: data.cycleRegularity || 'regular',
      usual_cycle_length: data.usualCycleLength || 28,
      usual_bleeding_duration_days: durationDaysNum,
      preferred_language: data.preferredLanguage || 'en',
      consent_status: data.consentStorage,
      is_demo: false,
      created_at: new Date().toISOString()
    };
    setCurrentUser(newUser);

    if (data.menstrualJourney === 'not_started') {
      setActiveTab('firstperiod');
    } else {
      setActiveTab('dashboard');
    }
  }

  const isHinglish = language === 'hinglish';
  const t = translations[language];

  // 1. Splash Screen
  if (appFlow === 'splash') {
    return <SplashScreen onComplete={() => setAppFlow('landing')} />;
  }

  // 2. Landing Page
  if (appFlow === 'landing') {
    return (
      <>
        <LandingPage
          onStartOnboarding={() => setAppFlow('onboarding')}
          onOpenPrivacy={() => {
            setAppFlow('dashboard');
            setActiveTab('privacy');
          }}
          onOpenDoctorLibrary={() => setShowDoctorArticlesModal(true)}
        />
        <DoctorArticlesModal
          isOpen={showDoctorArticlesModal}
          onClose={() => setShowDoctorArticlesModal(false)}
        />
        <ExitConfirmModal
          isOpen={showExitConfirm}
          onStay={() => setShowExitConfirm(false)}
          onExit={exitHerLifeApp}
        />
      </>
    );
  }

  // 3. Multi-Step Onboarding Wizard
  if (appFlow === 'onboarding') {
    return (
      <OnboardingWizard
        onComplete={(data) => {
          handleOnboardingComplete(data);
          setAppFlow('welcome');
        }}
        onCancel={() => setAppFlow('landing')}
      />
    );
  }

  // 4. Personalized Welcome Transition Screen
  if (appFlow === 'welcome') {
    return (
      <WelcomeTransition
        data={onboardingResult || {
          preferredName: currentUser.full_name,
          preferredLanguage: currentUser.preferred_language || 'en',
          age: currentUser.age_years,
          weightUnit: 'kg',
          generation: 'gen_z',
          menstrualJourney: 'started',
          pubertyEducationInterest: false,
          goals: ['Tracking my menstrual cycle'],
          consentStorage: true,
          consentAI: true,
          consentNotifications: true,
          selectedSymptoms: [],
          menopauseSymptoms: []
        }}
        onEnterDashboard={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('herlife_onboarding_completed', 'true');
          }
          setAppFlow('dashboard');
        }}
      />
    );
  }

  // 5. Main Dashboard View
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col font-sans text-warm-textDark antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* On-Screen Interactive Pre-Notification Toast Banner */}
      <NotificationToast
        show={toast.show}
        title={toast.title}
        body={toast.body}
        onDismiss={() => setToast({ ...toast, show: false })}
      />

      {/* Pre-Notification Center Modal */}
      <PreNotificationModal
        isOpen={showPreNotificationModal}
        onClose={() => setShowPreNotificationModal(false)}
        discreteMode={discreteMode}
        onToggleDiscrete={() => setDiscreteMode(!discreteMode)}
        language={language}
        onTriggerToast={handleTriggerToast}
      />

      {/* Header */}
      <Header
        currentUser={currentUser}
        demoUsers={demoUsers}
        onSelectUser={handleSelectUser}
        onUpdateStage={handleUpdateStage}
        discreteMode={discreteMode}
        onToggleDiscrete={() => setDiscreteMode(!discreteMode)}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'en' ? 'hinglish' : 'en')}
        onOpenPreNotifications={() => setShowPreNotificationModal(true)}
        onOpenThemeStudio={() => setShowThemeModal(true)}
        onOpenOnboarding={() => setAppFlow('onboarding')}
        onOpenLanding={() => setAppFlow('landing')}
        onBack={handleAppBack}
        canGoBack={activeTab !== 'dashboard' || tabHistory.length > 1}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            onNavigateTab={handleTabChange}
            language={language}
            onOpenVoiceAssistant={() => setShowVoiceModal(true)}
          />
        )}
        {activeTab === 'hercare' && (
          <HerCarePage
            currentUser={currentUser}
            onNavigateTab={handleTabChange}
            onBack={handleAppBack}
            language={language}
          />
        )}
        {activeTab === 'hermove' && (
          <HerMovePage
            currentUser={currentUser}
            onNavigateTab={handleTabChange}
            onBack={handleAppBack}
            language={language}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarPage currentUser={currentUser} />
        )}
        {activeTab === 'checkin' && (
          <CheckInPage currentUser={currentUser} onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'pcos' && (
          <PCOSPage currentUser={currentUser} />
        )}
        {activeTab === 'stress' && (
          <StressPage currentUser={currentUser} />
        )}
        {activeTab === 'lifestages' && (
          <LifeStagesPage currentUser={currentUser} onUpdateStage={handleUpdateStage} language={language} />
        )}
        {activeTab === 'firstperiod' && (
          <div className="space-y-6">
            <FirstPeriodEducationSlide
              language={language}
              defaultExpanded={true}
            />
          </div>
        )}
        {activeTab === 'aiguide' && (
          <AIGuidePage 
            currentUser={currentUser} 
            language={language} 
            onOpenVoiceAssistant={() => setShowVoiceModal(true)}
            onBack={handleAppBack}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsPage currentUser={currentUser} />
        )}
        {activeTab === 'privacy' && (
          <PrivacyPage
            currentUser={currentUser}
            discreteMode={discreteMode}
            onToggleDiscrete={() => setDiscreteMode(!discreteMode)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Floating Action Button: Talking Voice Assistant (Saheli AI) */}
      <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setShowVoiceModal(true)}
          className="group relative flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-rose-500 via-brand-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-glow transform hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-400" />
          </span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="hidden xs:inline sm:inline">Talk with Saheli</span>
          <span className="inline xs:hidden sm:hidden">Saheli Voice</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (< md screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        language={language}
      />

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        currentUser={currentUser}
      />

      <DoctorArticlesModal
        isOpen={showDoctorArticlesModal}
        onClose={() => setShowDoctorArticlesModal(false)}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      <ThemeStudioModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      {/* Native-feeling Exit Confirmation Modal */}
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onStay={() => setShowExitConfirm(false)}
        onExit={exitHerLifeApp}
      />

      {/* Footer with Medical Safety Statement & Quick Links */}
      <footer className="bg-white border-t border-warm-border mt-12 py-8 text-xs text-warm-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="font-bold text-warm-textDark font-serif text-sm">HER LIFE</span>
              <span>— "{t.app_tagline}"</span>
            </div>
            
            {/* Quick Links */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setShowDoctorArticlesModal(true)}
                className="hover:text-brand-600 flex items-center gap-1 transition"
              >
                <Award className="w-3.5 h-3.5 text-brand-600" />
                <span>Doctor Library & Sources</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="hover:text-brand-600 flex items-center gap-1 transition"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500" />
                <span>Feedback & Ideas</span>
              </button>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isHinglish ? 'Surakshit & Private' : 'Privacy Safeguarded'}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-warm-cardMuted/60 rounded-2xl border border-warm-border/60 text-[11px] leading-relaxed">
            <strong>{isHinglish ? 'Medical Aur Educational Disclaimer:' : 'Medical & Educational Disclaimer:'}</strong>{' '}
            {isHinglish 
              ? 'HER LIFE ek AI health tracking aur educational companion hai. Sabhi predictions aur trends mathematical anumaan hain, kisi clinical diagnosis ya medical treatment ka badal nahi hain. Kisi bhi gambhir dard ya aniyamit bleeding ke liye licensed doctor se sampark karein.'
              : 'HER LIFE is an AI-powered health tracking and educational platform. Algorithm predictions, cycle estimates, and symptom trends are mathematical projections based on user-entered logs and do NOT constitute clinical diagnosis, medical treatment, or contraception. Always consult a licensed healthcare professional for clinical concerns, severe pelvic pain, or irregular bleeding patterns.'}
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
