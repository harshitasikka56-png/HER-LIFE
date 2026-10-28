import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Clock, 
  Calendar, 
  Droplets, 
  Heart, 
  Sparkles, 
  Activity, 
  Pill, 
  MessageSquareHeart, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  RotateCcw, 
  Sliders, 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language, translations } from '../services/i18n';
import { 
  notificationService, 
  AppNotificationSettings, 
  CategoryKey, 
  CategoryConfig,
  CustomMedication,
  DEFAULT_NOTIFICATION_SETTINGS 
} from '../services/notificationService';
import { soundStudio, RINGTONE_OPTIONS } from '../services/soundStudio';
import { RingtonePickerModal } from './RingtonePickerModal';
import { useBackHandler } from '../services/backNavigation';

interface PreNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  discreteMode: boolean;
  onToggleDiscrete: () => void;
  language: Language;
  onTriggerToast: (title: string, body: string) => void;
}

type TabKey = 'master' | 'categories' | 'medications' | 'test';

export const PreNotificationModal: React.FC<PreNotificationModalProps> = ({
  isOpen,
  onClose,
  discreteMode,
  onToggleDiscrete,
  language,
  onTriggerToast
}) => {
  const isHinglish = language === 'hinglish';
  const t = translations[language]?.notifications || translations['en'].notifications;

  const [settings, setSettings] = useState<AppNotificationSettings>(notificationService.getSettings());
  const [activeTab, setActiveTab] = useState<TabKey>('categories');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [savedNotice, setSavedNotice] = useState<string>('');

  // Ringtone picker modal state
  const [ringtonePickerOpen, setRingtonePickerOpen] = useState(false);
  const [targetCategoryForRingtone, setTargetCategoryForRingtone] = useState<CategoryKey | 'master'>('master');

  // New medication form
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('20:00');
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // Playing preview tracking
  const [playingRingtoneId, setPlayingRingtoneId] = useState<string | null>(null);

  // Back button handling on Android
  useBackHandler(
    'notification_settings_modal',
    75,
    () => {
      if (isOpen) {
        soundStudio.stopPreview();
        onClose();
        return true;
      }
      return false;
    },
    isOpen
  );

  useEffect(() => {
    if (isOpen) {
      setSettings(notificationService.getSettings());
      notificationService.checkPermissionStatus().then(setPermissionGranted);
    } else {
      soundStudio.stopPreview();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = soundStudio.subscribePlaying(setPlayingRingtoneId);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  function handleSaveAll() {
    const updated = {
      ...settings,
      discreteMode
    };
    notificationService.saveSettings(updated);
    setSavedNotice(isHinglish ? "Settings safalta se save ho gayi hain!" : "Notification settings saved successfully!");
    onTriggerToast(
      isHinglish ? "Notification Preferences Updated" : "Preferences Saved",
      isHinglish ? "Aapke notification aur sound changes apply ho chuke hain." : "Your category alerts, sounds and quiet hours are updated."
    );
    setTimeout(() => setSavedNotice(''), 3000);
  }

  function handleResetAll() {
    const res = notificationService.resetToDefault();
    setSettings(res);
    setSavedNotice(isHinglish ? "Settings default par reset ho gayi hain." : "All notification settings reset to default.");
    setTimeout(() => setSavedNotice(''), 3000);
  }

  function handleCategoryToggle(key: CategoryKey) {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: {
          ...prev.categories[key],
          enabled: !prev.categories[key].enabled
        }
      }
    }));
  }

  function handleCategoryVibrationToggle(key: CategoryKey) {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: {
          ...prev.categories[key],
          vibration: !prev.categories[key].vibration
        }
      }
    }));
  }

  function handleCategoryScheduleChange(key: CategoryKey, schedule: string) {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: {
          ...prev.categories[key],
          schedule
        }
      }
    }));
  }

  function handleResetCategory(key: CategoryKey) {
    const def = DEFAULT_NOTIFICATION_SETTINGS.categories[key];
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: { ...def }
      }
    }));
  }

  function openRingtonePicker(target: CategoryKey | 'master') {
    setTargetCategoryForRingtone(target);
    setRingtonePickerOpen(true);
  }

  function handleSelectedRingtone(ringtoneId: string) {
    if (targetCategoryForRingtone === 'master') {
      setSettings(prev => ({
        ...prev,
        master: {
          ...prev.master,
          masterRingtone: ringtoneId
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [targetCategoryForRingtone]: {
            ...prev.categories[targetCategoryForRingtone],
            ringtone: ringtoneId
          }
        }
      }));
    }
  }

  function handlePreviewRingtone(ringtoneId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (playingRingtoneId === ringtoneId) {
      soundStudio.stopPreview();
    } else {
      soundStudio.playPreview(ringtoneId, settings.master.volume, true);
    }
  }

  async function handleRequestPermission() {
    const granted = await notificationService.requestPermission();
    setPermissionGranted(granted);
    if (granted) {
      onTriggerToast(
        "Android Permission Granted",
        "HER LIFE can now deliver timely cycle, hydration and medicine alerts."
      );
    }
  }

  async function handleSendTest(categoryKey: CategoryKey) {
    const res = await notificationService.triggerTestNotification(categoryKey);
    onTriggerToast(res.title, res.body);
  }

  function handleAddMedication(e: React.FormEvent) {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newMed: CustomMedication = {
      id: `med_${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDosage.trim() || 'As directed',
      time: newMedTime || '20:00',
      enabled: true,
      days: 'Daily'
    };

    setSettings(prev => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));

    setNewMedName('');
    setNewMedDosage('');
    setShowAddMedForm(false);
  }

  function handleDeleteMedication(id: string) {
    setSettings(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
  }

  function handleToggleMedication(id: string) {
    setSettings(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    }));
  }

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    Calendar,
    Heart,
    Droplets,
    Sparkles,
    Activity,
    Pill,
    MessageSquareHeart,
    Bell
  };

  const getTargetTitle = () => {
    if (targetCategoryForRingtone === 'master') return 'Master Notification Sound';
    return settings.categories[targetCategoryForRingtone]?.title || 'Category Sound';
  };

  const currentSelectedRingtoneId = () => {
    if (targetCategoryForRingtone === 'master') return settings.master.masterRingtone;
    return settings.categories[targetCategoryForRingtone]?.ringtone || 'default';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-2xl w-full border border-warm-border shadow-2xl flex flex-col h-[94vh] sm:h-[90vh] max-h-[94vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-warm-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-xs">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-warm-textDark font-serif">
                  {isHinglish ? "Notification & Voice Settings" : "Smart Notification Settings"}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase tracking-wider">
                  Pro Control
                </span>
              </div>
              <p className="text-xs text-warm-textMuted">
                {isHinglish 
                  ? "Ringtones, vibration, category alerts aur quiet hours ka poora control"
                  : "Complete control over reminders, sounds, vibration & categories"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-warm-textMuted hover:text-warm-textDark hover:bg-warm-cardMuted transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Success Toast within modal */}
        {savedNotice && (
          <div className="my-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{savedNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 pt-3 pb-2 border-b border-warm-border/60 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'categories'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark hover:bg-warm-border'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {isHinglish ? "8 Categories" : "Categories (8)"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'master'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark hover:bg-warm-border'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isHinglish ? "Master Controls" : "Master Controls"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('medications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'medications'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark hover:bg-warm-border'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            {isHinglish ? "Medicines" : "My Medications"}
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
              {settings.medications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('test')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'test'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark hover:bg-warm-border'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {isHinglish ? "Live Test" : "Test Notifications"}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">

          {/* TAB 1: 8 CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-900">Independent Category Settings</h4>
                  <p className="text-[11px] text-rose-700/80">Customize sound, vibration and schedule separately for each notification type.</p>
                </div>
                <button
                  type="button"
                  onClick={onToggleDiscrete}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 text-[11px] font-bold text-rose-800 hover:bg-rose-50 transition flex items-center gap-1 shadow-2xs"
                  title="Toggle Lockscreen Privacy (Parda Mode)"
                >
                  {discreteMode ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5 text-gray-500" />}
                  <span>{discreteMode ? "Discrete ON" : "Discrete OFF"}</span>
                </button>
              </div>

              {(Object.keys(settings.categories) as CategoryKey[]).map((key, idx) => {
                const cat = settings.categories[key];
                const IconComponent = categoryIcons[cat.icon] || Bell;
                const ringtone = RINGTONE_OPTIONS.find(r => r.id === cat.ringtone) || RINGTONE_OPTIONS[0];
                const isPlaying = playingRingtoneId === ringtone.id;

                return (
                  <div 
                    key={cat.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      cat.enabled 
                        ? 'bg-white border-warm-border shadow-2xs' 
                        : 'bg-warm-cardMuted/40 border-warm-border/60 opacity-70'
                    }`}
                  >
                    {/* Top Row: Icon, Title & Enable Switch */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          cat.enabled ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-warm-textDark truncate">{idx + 1}. {cat.title}</span>
                          </div>
                          <p className="text-[11px] text-warm-textMuted line-clamp-1">{cat.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                          cat.enabled ? 'bg-rose-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                            cat.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Controls Row (Active only when enabled) */}
                    {cat.enabled && (
                      <div className="mt-3 pt-3 border-t border-warm-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        
                        {/* Sound & Preview */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-warm-cardMuted/60 border border-warm-border/60">
                          <button
                            type="button"
                            onClick={() => openRingtonePicker(key)}
                            className="flex items-center gap-1.5 text-left min-w-0 flex-1 hover:text-rose-600 transition"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-warm-textMuted block">Sound</span>
                              <span className="text-xs font-bold text-warm-textDark truncate block">{ringtone.name}</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handlePreviewRingtone(ringtone.id, e)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition shrink-0 ${
                              isPlaying ? 'bg-rose-600 text-white' : 'bg-white text-warm-textDark hover:bg-rose-100'
                            }`}
                            title={isPlaying ? "Stop" : "Preview"}
                          >
                            {isPlaying ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                          </button>
                        </div>

                        {/* Vibration Toggle */}
                        <button
                          type="button"
                          onClick={() => handleCategoryVibrationToggle(key)}
                          className={`flex items-center justify-between p-2 rounded-xl border transition ${
                            cat.vibration ? 'bg-rose-50/60 border-rose-200 text-rose-800' : 'bg-warm-cardMuted/60 border-warm-border/60 text-warm-textMuted'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Vibrate className="w-3.5 h-3.5" />
                            <div className="text-left">
                              <span className="text-[10px] block">Vibration</span>
                              <span className="text-xs font-bold block">{cat.vibration ? "Enabled" : "Off"}</span>
                            </div>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${cat.vibration ? 'bg-rose-600' : 'bg-gray-300'}`} />
                        </button>

                        {/* Schedule / Frequency */}
                        <div className="p-2 rounded-xl bg-warm-cardMuted/60 border border-warm-border/60 flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-warm-textMuted block">Timing</span>
                            <select
                              value={cat.schedule}
                              onChange={(e) => handleCategoryScheduleChange(key, e.target.value)}
                              className="text-xs font-bold text-warm-textDark bg-transparent border-0 p-0 focus:ring-0 cursor-pointer w-full"
                            >
                              {cat.frequencyOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleResetCategory(key)}
                            className="p-1 text-warm-textMuted hover:text-warm-textDark transition ml-1"
                            title="Reset Category to Default"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: MASTER CONTROLS */}
          {activeTab === 'master' && (
            <div className="space-y-4">
              
              {/* Permission Banner */}
              <div className="p-4 rounded-2xl border bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Android Notification Permission</h4>
                    <p className="text-[11px] text-amber-800">
                      Status: <strong className={permissionGranted ? "text-emerald-700" : "text-rose-700"}>
                        {permissionGranted === true ? "Granted (Active)" : permissionGranted === false ? "Denied in Settings" : "System Prompt Required"}
                      </strong>
                    </p>
                  </div>
                </div>
                {!permissionGranted && (
                  <button
                    type="button"
                    onClick={handleRequestPermission}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Grant Permission
                  </button>
                )}
              </div>

              {/* Master Toggles Grid */}
              <div className="p-4 rounded-2xl bg-white border border-warm-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-warm-textMuted font-mono">Master System Controls</h4>

                {/* 1. All Notifications Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                  <div className="flex items-center gap-2.5">
                    {settings.master.enabled ? <Bell className="w-4 h-4 text-rose-600" /> : <BellOff className="w-4 h-4 text-gray-400" />}
                    <div>
                      <span className="text-xs font-bold text-warm-textDark block">Allow All Notifications</span>
                      <span className="text-[11px] text-warm-textMuted">Master switch for all period, ovulation, water & wellness alerts</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, master: { ...p.master, enabled: !p.master.enabled } }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      settings.master.enabled ? 'bg-rose-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                      settings.master.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 2. Sound Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                  <div className="flex items-center gap-2.5">
                    {settings.master.soundEnabled ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                    <div>
                      <span className="text-xs font-bold text-warm-textDark block">Notification Sound</span>
                      <span className="text-[11px] text-warm-textMuted">Play ringtone audio with incoming reminders</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, master: { ...p.master, soundEnabled: !p.master.soundEnabled } }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      settings.master.soundEnabled ? 'bg-rose-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                      settings.master.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 3. Vibration Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                  <div className="flex items-center gap-2.5">
                    <Vibrate className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="text-xs font-bold text-warm-textDark block">Device Vibration</span>
                      <span className="text-[11px] text-warm-textMuted">Haptic pulse when notification fires</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, master: { ...p.master, vibrationEnabled: !p.master.vibrationEnabled } }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      settings.master.vibrationEnabled ? 'bg-rose-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                      settings.master.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 4. Master Ringtone Selection */}
                <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                  <div>
                    <span className="text-xs font-bold text-warm-textDark block">Default Ringtone</span>
                    <span className="text-[11px] text-warm-textMuted">Fallback tone for any notification without custom sound</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openRingtonePicker('master')}
                      className="px-3 py-1.5 rounded-xl bg-warm-cardMuted hover:bg-warm-border text-xs font-bold text-warm-textDark border border-warm-border transition"
                    >
                      {RINGTONE_OPTIONS.find(r => r.id === settings.master.masterRingtone)?.name || 'Default'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handlePreviewRingtone(settings.master.masterRingtone, e)}
                      className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition"
                      title="Preview master ringtone"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* 5. Notification Volume */}
                <div className="space-y-1.5 pb-3 border-b border-warm-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-warm-textDark">Notification Volume</span>
                    <span className="text-xs font-mono font-bold text-rose-600">{settings.master.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.master.volume}
                    onChange={(e) => setSettings(p => ({ ...p, master: { ...p.master, volume: Number(e.target.value) } }))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* 6. Quiet Hours (Do Not Disturb) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-plum-600" />
                      <span className="text-xs font-bold text-warm-textDark">Quiet Hours (Do Not Disturb)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings(p => ({ ...p, master: { ...p.master, quietHoursEnabled: !p.master.quietHoursEnabled } }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        settings.master.quietHoursEnabled ? 'bg-plum-700' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.master.quietHoursEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  {settings.master.quietHoursEnabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 p-2 rounded-xl bg-warm-cardMuted border border-warm-border">
                        <span className="text-[10px] text-warm-textMuted block">Mute From:</span>
                        <input
                          type="time"
                          value={settings.master.quietHoursStart}
                          onChange={(e) => setSettings(p => ({ ...p, master: { ...p.master, quietHoursStart: e.target.value } }))}
                          className="text-xs font-bold text-warm-textDark bg-transparent border-0 p-0 focus:ring-0 w-full"
                        />
                      </div>
                      <span className="text-xs text-warm-textMuted font-bold">to</span>
                      <div className="flex-1 p-2 rounded-xl bg-warm-cardMuted border border-warm-border">
                        <span className="text-[10px] text-warm-textMuted block">Wake At:</span>
                        <input
                          type="time"
                          value={settings.master.quietHoursEnd}
                          onChange={(e) => setSettings(p => ({ ...p, master: { ...p.master, quietHoursEnd: e.target.value } }))}
                          className="text-xs font-bold text-warm-textDark bg-transparent border-0 p-0 focus:ring-0 w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: MEDICATIONS */}
          {activeTab === 'medications' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-900">Custom Medication & Supplement Reminders</h4>
                  <p className="text-[11px] text-purple-700">Only medicines and supplements you explicitly add will trigger reminders.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMedForm(!showAddMedForm)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medicine
                </button>
              </div>

              {/* Add form */}
              {showAddMedForm && (
                <form onSubmit={handleAddMedication} className="p-4 bg-white rounded-2xl border border-purple-200 shadow-xs space-y-3 animate-fade-in">
                  <h5 className="text-xs font-bold text-warm-textDark">Add New Pill or Supplement Reminder</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-warm-textMuted block font-bold mb-1">Medicine Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Iron & Folic Acid"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-warm-border text-xs focus:ring-1 focus:ring-purple-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-warm-textMuted block font-bold mb-1">Dosage / Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 Tablet after lunch"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-warm-border text-xs focus:ring-1 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-warm-textMuted block font-bold mb-1">Reminder Time</label>
                      <input
                        type="time"
                        value={newMedTime}
                        onChange={(e) => setNewMedTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-warm-border text-xs focus:ring-1 focus:ring-purple-400 font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddMedForm(false)}
                      className="px-3 py-1.5 rounded-xl border border-warm-border text-xs text-warm-textDark hover:bg-warm-cardMuted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
                    >
                      Save Reminder
                    </button>
                  </div>
                </form>
              )}

              {/* Medication List */}
              <div className="space-y-2">
                {settings.medications.length === 0 ? (
                  <div className="p-8 text-center bg-warm-cardMuted/40 rounded-2xl border border-warm-border">
                    <Pill className="w-8 h-8 text-warm-textMuted mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-warm-textMuted">No medication reminders added yet.</p>
                    <p className="text-[11px] text-warm-textMuted/80">Tap 'Add Medicine' to schedule your daily vitamins, iron, or supplements.</p>
                  </div>
                ) : (
                  settings.medications.map((med) => (
                    <div 
                      key={med.id}
                      className="p-3.5 rounded-2xl bg-white border border-warm-border flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          med.enabled ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Pill className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-warm-textDark block truncate">{med.name}</span>
                          <span className="text-[11px] text-warm-textMuted block truncate">{med.dosage} • Time: {med.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleMedication(med.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                            med.enabled 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {med.enabled ? 'Active' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedication(med.id)}
                          className="p-1.5 rounded-lg text-warm-textMuted hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete medication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: LIVE TEST NOTIFICATIONS */}
          {activeTab === 'test' && (
            <div className="space-y-3">
              <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-100">
                <h4 className="text-xs font-bold text-brand-900">Realtime Notification Simulator</h4>
                <p className="text-[11px] text-brand-800">
                  Tap any card below to test how real Android notification channels, sounds, and banners behave on your device right now.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(settings.categories) as CategoryKey[]).map((key) => {
                  const cat = settings.categories[key];
                  const Icon = categoryIcons[cat.icon] || Bell;

                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => handleSendTest(key)}
                      className="p-3 rounded-2xl bg-white border border-warm-border hover:border-rose-300 hover:bg-rose-50/30 transition text-left flex items-center justify-between group active:scale-98 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-warm-cardMuted text-warm-textDark group-hover:bg-rose-100 group-hover:text-rose-600 flex items-center justify-center shrink-0 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-warm-textDark block truncate">{cat.title}</span>
                          <span className="text-[10px] text-warm-textMuted block">Plays {cat.ringtone} sound</span>
                        </div>
                      </div>
                      <Play className="w-3.5 h-3.5 text-rose-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-3 border-t border-warm-border flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            className="w-full sm:w-auto text-xs font-semibold text-warm-textMuted hover:text-warm-textDark py-2 px-3 rounded-xl hover:bg-warm-cardMuted transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Defaults
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none text-xs font-bold text-warm-textDark py-2.5 px-4 rounded-xl border border-warm-border hover:bg-warm-cardMuted transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex-1 sm:flex-none text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 py-2.5 px-6 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>

      </div>

      {/* Ringtone Selection Modal Overlay */}
      <RingtonePickerModal
        isOpen={ringtonePickerOpen}
        onClose={() => setRingtonePickerOpen(false)}
        targetCategoryTitle={getTargetTitle()}
        selectedRingtoneId={currentSelectedRingtoneId()}
        onSelectRingtone={handleSelectedRingtone}
        masterVolume={settings.master.volume}
      />
    </div>
  );
};
