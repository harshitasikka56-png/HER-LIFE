/**
 * HER LIFE — Advanced Smart Notification Service
 * Android Channel Management, Scheduling, Master Controls & Category Settings.
 */

import { LocalNotifications, Channel } from '@capacitor/local-notifications';
import { soundStudio, RINGTONE_OPTIONS } from './soundStudio';

export type CategoryKey = 
  | 'period'
  | 'ovulation'
  | 'hydration'
  | 'wellness'
  | 'exercise'
  | 'medication'
  | 'saheli'
  | 'updates';

export interface CategoryConfig {
  id: CategoryKey;
  title: string;
  nativeTitleHinglish: string;
  description: string;
  enabled: boolean;
  ringtone: string;
  vibration: boolean;
  schedule: string;
  frequencyOptions: string[];
  icon: string;
}

export interface CustomMedication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  enabled: boolean;
  days: string;
}

export interface MasterNotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  masterRingtone: string;
  volume: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface AppNotificationSettings {
  master: MasterNotificationSettings;
  categories: Record<CategoryKey, CategoryConfig>;
  medications: CustomMedication[];
  discreteMode: boolean;
  lastUpdated: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: AppNotificationSettings = {
  master: {
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    masterRingtone: 'default',
    volume: 85,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  },
  categories: {
    period: {
      id: 'period',
      title: 'Period Reminders',
      nativeTitleHinglish: 'Period Predictions & Start Alerts',
      description: 'Advance period predictions, start date warnings, and phase changes.',
      enabled: true,
      ringtone: 'gentle',
      vibration: true,
      schedule: '2 Days Before',
      frequencyOptions: ['1 Day Before', '2 Days Before', '3 Days Before', 'On Period Day'],
      icon: 'Calendar'
    },
    ovulation: {
      id: 'ovulation',
      title: 'Ovulation & Fertility Reminders',
      nativeTitleHinglish: 'Ovulation & Fertile Window Alerts',
      description: 'Estimated ovulation day alerts and peak fertility window reminders.',
      enabled: true,
      ringtone: 'melody',
      vibration: true,
      schedule: 'Morning (09:00 AM)',
      frequencyOptions: ['Morning (09:00 AM)', 'Evening (06:00 PM)', '1 Day Prior'],
      icon: 'Heart'
    },
    hydration: {
      id: 'hydration',
      title: 'Hydration Reminders',
      nativeTitleHinglish: 'Water & Warm Fluids Drinking Alerts',
      description: 'Regular water intake reminders to soothe cramps and maintain cellular balance.',
      enabled: true,
      ringtone: 'waterdrop',
      vibration: true,
      schedule: 'Every 2 Hours',
      frequencyOptions: ['Every 1 Hour', 'Every 2 Hours', 'Every 3 Hours', 'Every 4 Hours'],
      icon: 'Droplets'
    },
    wellness: {
      id: 'wellness',
      title: 'Daily Wellness Tips',
      nativeTitleHinglish: 'Rozana Health Advice & Lifestyle Guidance',
      description: 'Targeted DOs, DON\'Ts, and nutrition tailored to your current cycle day.',
      enabled: true,
      ringtone: 'nature',
      vibration: false,
      schedule: 'Morning (08:30 AM)',
      frequencyOptions: ['Morning (08:30 AM)', 'Afternoon (01:00 PM)', 'Evening (08:00 PM)'],
      icon: 'Sparkles'
    },
    exercise: {
      id: 'exercise',
      title: 'Exercise & Yoga Reminders',
      nativeTitleHinglish: 'HER MOVE Workout & Stretches Alerts',
      description: 'Gentle menstrual yoga, pelvic opening, or energizing workout prompts.',
      enabled: true,
      ringtone: 'chime',
      vibration: true,
      schedule: 'Daily (07:30 AM)',
      frequencyOptions: ['Morning (07:30 AM)', 'Evening (06:30 PM)', 'Alternate Days'],
      icon: 'Activity'
    },
    medication: {
      id: 'medication',
      title: 'Medication or Supplement Reminders',
      nativeTitleHinglish: 'Iron, Calcium & Custom Medicine Reminders',
      description: 'Timely reminders only for vitamins, iron, and medicines you explicitly add.',
      enabled: true,
      ringtone: 'bell',
      vibration: true,
      schedule: 'Per Prescription Time',
      frequencyOptions: ['Custom Schedule', 'Morning & Night', 'Once Daily'],
      icon: 'Pill'
    },
    saheli: {
      id: 'saheli',
      title: 'Saheli Messages & Check-Ins',
      nativeTitleHinglish: 'Saheli Daily Care & Motivational Whisper',
      description: 'Empathetic evening check-ins, verbal reward gestures, and comfort guidance.',
      enabled: true,
      ringtone: 'melody',
      vibration: true,
      schedule: 'Evening (08:00 PM)',
      frequencyOptions: ['Evening (08:00 PM)', 'Bedtime (09:30 PM)', 'Morning (09:00 AM)'],
      icon: 'MessageSquareHeart'
    },
    updates: {
      id: 'updates',
      title: 'App Updates & General Notifications',
      nativeTitleHinglish: 'App Enhancements & Important Announcements',
      description: 'Feature releases, security updates, and critical health companion notices.',
      enabled: true,
      ringtone: 'digital',
      vibration: false,
      schedule: 'As Available',
      frequencyOptions: ['Instant', 'Weekly Digest', 'Silent'],
      icon: 'Bell'
    }
  },
  medications: [
    {
      id: 'med_iron_1',
      name: 'Iron & Folic Acid',
      dosage: '1 Tablet after lunch',
      time: '14:00',
      enabled: true,
      days: 'Daily'
    },
    {
      id: 'med_omega_2',
      name: 'Vitamin D3 & Calcium',
      dosage: '1 Capsule morning',
      time: '09:00',
      enabled: true,
      days: 'Daily'
    }
  ],
  discreteMode: true,
  lastUpdated: new Date().toISOString()
};

const STORAGE_KEY = 'her_life_notification_settings_v3';

class NotificationService {
  private settings: AppNotificationSettings;
  private permissionGranted: boolean | null = null;
  private isCapacitorNative: boolean = false;

  constructor() {
    this.settings = this.loadSettings();
    this.checkEnvironment();
  }

  private checkEnvironment() {
    if (typeof window !== 'undefined') {
      const isAndroidCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();
      this.isCapacitorNative = isAndroidCapacitor;
      this.checkPermissionStatus();
    }
  }

  public loadSettings(): AppNotificationSettings {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_NOTIFICATION_SETTINGS,
          ...parsed,
          master: { ...DEFAULT_NOTIFICATION_SETTINGS.master, ...(parsed.master || {}) },
          categories: { ...DEFAULT_NOTIFICATION_SETTINGS.categories, ...(parsed.categories || {}) },
          medications: Array.isArray(parsed.medications) ? parsed.medications : DEFAULT_NOTIFICATION_SETTINGS.medications
        };
      }
    } catch (e) {
      console.warn('Failed to load notification settings from localStorage:', e);
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  public saveSettings(newSettings: AppNotificationSettings): boolean {
    this.settings = {
      ...newSettings,
      lastUpdated: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      this.syncAndroidChannels();
      return true;
    } catch (e) {
      console.error('Failed to save notification settings:', e);
      return false;
    }
  }

  public getSettings(): AppNotificationSettings {
    return { ...this.settings };
  }

  public async checkPermissionStatus(): Promise<boolean> {
    try {
      if (this.isCapacitorNative) {
        const perm = await LocalNotifications.checkPermissions();
        this.permissionGranted = perm.display === 'granted';
        return this.permissionGranted;
      } else if (typeof Notification !== 'undefined') {
        this.permissionGranted = Notification.permission === 'granted';
        return this.permissionGranted;
      }
    } catch (e) {
      console.warn('Permission check error:', e);
    }
    return false;
  }

  public async requestPermission(): Promise<boolean> {
    try {
      if (this.isCapacitorNative) {
        const result = await LocalNotifications.requestPermissions();
        const granted = result.display === 'granted';
        this.permissionGranted = granted;
        if (granted) {
          await this.syncAndroidChannels();
        }
        return granted;
      } else if (typeof Notification !== 'undefined') {
        const result = await Notification.requestPermission();
        this.permissionGranted = result === 'granted';
        return this.permissionGranted;
      }
    } catch (e) {
      console.error('Request notification permission failed:', e);
    }
    return false;
  }

  /**
   * Configure native Android Notification Channels for all 8 categories
   */
  public async syncAndroidChannels(): Promise<void> {
    if (!this.isCapacitorNative) return;

    try {
      const channelKeys: CategoryKey[] = [
        'period', 'ovulation', 'hydration', 'wellness', 
        'exercise', 'medication', 'saheli', 'updates'
      ];

      for (const key of channelKeys) {
        const cat = this.settings.categories[key];
        const ringtoneId = cat.ringtone || this.settings.master.masterRingtone || 'default';
        const ringtone = RINGTONE_OPTIONS.find(r => r.id === ringtoneId) || RINGTONE_OPTIONS[0];

        // Sound resource name in res/raw (lowercase filename without extension, avoid reserved keywords)
        const soundResName = ringtone.id === 'default' ? 'sound_default' : ringtone.id;

        const channel: Channel = {
          id: `channel_her_life_${key}`,
          name: `HER LIFE — ${cat.title}`,
          description: cat.description,
          importance: this.settings.master.enabled && cat.enabled ? 4 : 1, // 4 = HIGH, 1 = MIN
          visibility: this.settings.discreteMode ? 0 : 1, // 0 = PRIVATE, 1 = PUBLIC
          sound: this.settings.master.soundEnabled ? `${soundResName}.wav` : undefined,
          vibration: this.settings.master.vibrationEnabled && cat.vibration,
          lights: true,
          lightColor: '#C26D5C'
        };

        await LocalNotifications.createChannel(channel);
      }
      console.log('✅ Android Notification Channels synchronized successfully.');
    } catch (err) {
      console.warn('Android channel registration notice:', err);
    }
  }

  /**
   * Trigger an immediate test notification via Capacitor on Android or browser
   */
  public async triggerTestNotification(
    categoryKey: CategoryKey = 'period',
    customTitle?: string,
    customBody?: string
  ): Promise<{ delivered: boolean; title: string; body: string }> {
    const cat = this.settings.categories[categoryKey] || this.settings.categories.period;
    const isDiscrete = this.settings.discreteMode;

    let title = customTitle || (isDiscrete 
      ? 'HerLife: Scheduled Health Check-In' 
      : `${cat.title} Alert`);

    let body = customBody || (isDiscrete
      ? 'Your private health sanctuary is updated.'
      : `Advance alert: Your personalized cycle update is ready in HER LIFE.`);

    // Play acoustic preview if sound is enabled
    if (this.settings.master.enabled && this.settings.master.soundEnabled) {
      const ringtoneId = cat.ringtone || this.settings.master.masterRingtone || 'default';
      soundStudio.playPreview(
        ringtoneId, 
        this.settings.master.volume, 
        this.settings.master.vibrationEnabled && cat.vibration
      );
    }

    // Deliver via Capacitor Local Notifications if native
    if (this.isCapacitorNative) {
      try {
        const ringtoneId = cat.ringtone || this.settings.master.masterRingtone || 'default';
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Math.random() * 100000),
              title,
              body,
              channelId: `channel_her_life_${categoryKey}`,
              sound: `${ringtoneId}.wav`,
              schedule: { at: new Date(Date.now() + 500) }
            }
          ]
        });
        return { delivered: true, title, body };
      } catch (err) {
        console.warn('Native local notification dispatch error:', err);
      }
    }

    // Browser Notification fallback
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/logo.png',
          badge: '/logo.png'
        });
        return { delivered: true, title, body };
      } catch (e) {
        // ignore
      }
    }

    return { delivered: true, title, body };
  }

  public resetToDefault(): AppNotificationSettings {
    this.settings = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    this.saveSettings(this.settings);
    return this.settings;
  }

  public resetCategoryToDefault(key: CategoryKey): CategoryConfig {
    this.settings.categories[key] = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS.categories[key]));
    this.saveSettings(this.settings);
    return this.settings.categories[key];
  }
}

export const notificationService = new NotificationService();
