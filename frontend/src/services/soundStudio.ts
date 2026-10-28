/**
 * HER LIFE — Studio Sound Engine & Ringtone Library
 * Real acoustic notification sound synthesis and audio playback.
 */

export interface RingtoneItem {
  id: string;
  name: string;
  description: string;
  soundFile: string;
  badge: string;
  vibrationPattern: number[];
}

export const RINGTONE_OPTIONS: RingtoneItem[] = [
  {
    id: 'default',
    name: 'Default Notification',
    description: 'Clean dual-tone harmonic chime',
    soundFile: '/sounds/sound_default.wav',
    badge: 'Standard',
    vibrationPattern: [0, 150, 100, 200]
  },
  {
    id: 'chime',
    name: 'Gentle Chime',
    description: 'Soft wind chime shimmer with warm resonance',
    soundFile: '/sounds/chime.wav',
    badge: 'Calm',
    vibrationPattern: [0, 100, 80, 150]
  },
  {
    id: 'bell',
    name: 'Soft Bell',
    description: 'Meditative Tibetan bowl bell with deep decay',
    soundFile: '/sounds/bell.wav',
    badge: 'Peaceful',
    vibrationPattern: [0, 200, 120, 250]
  },
  {
    id: 'digital',
    name: 'Digital Alert',
    description: 'Crisp, contemporary electronic chirp',
    soundFile: '/sounds/digital.wav',
    badge: 'Modern',
    vibrationPattern: [0, 100, 50, 100]
  },
  {
    id: 'waterdrop',
    name: 'Water Drop',
    description: 'Acoustic fluid droplet with natural bubble burst',
    soundFile: '/sounds/waterdrop.wav',
    badge: 'Organic',
    vibrationPattern: [0, 80]
  },
  {
    id: 'nature',
    name: 'Nature Tone',
    description: 'Sweet morning bird acoustic whistle triplet',
    soundFile: '/sounds/nature.wav',
    badge: 'Relaxing',
    vibrationPattern: [0, 120, 60, 120, 60, 120]
  },
  {
    id: 'melody',
    name: 'Soft Melody',
    description: '4-note soothing pentatonic acoustic motif',
    soundFile: '/sounds/melody.wav',
    badge: 'Harmonic',
    vibrationPattern: [0, 150, 80, 150]
  },
  {
    id: 'beep',
    name: 'Classic Beep',
    description: 'Classic dual-pulse reminder tone',
    soundFile: '/sounds/beep.wav',
    badge: 'Classic',
    vibrationPattern: [0, 120, 80, 120]
  }
];

class SoundStudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private currentlyPlayingId: string | null = null;
  private previewListeners: Set<(ringtoneId: string | null) => void> = new Set();

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  public subscribePlaying(listener: (ringtoneId: string | null) => void): () => void {
    this.previewListeners.add(listener);
    listener(this.currentlyPlayingId);
    return () => this.previewListeners.delete(listener);
  }

  private notify(id: string | null) {
    this.currentlyPlayingId = id;
    this.previewListeners.forEach(fn => fn(id));
  }

  public stopPreview() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }
    this.notify(null);
  }

  public async playPreview(ringtoneId: string, volume: number = 80, triggerVibration: boolean = true): Promise<void> {
    this.stopPreview();

    const ringtone = RINGTONE_OPTIONS.find(r => r.id === ringtoneId) || RINGTONE_OPTIONS[0];

    // Optional haptic vibration preview on supported devices
    if (triggerVibration && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ringtone.vibrationPattern);
      } catch (e) {
        // ignore
      }
    }

    try {
      const audio = new Audio(ringtone.soundFile);
      this.currentAudio = audio;
      audio.volume = Math.max(0, Math.min(1, volume / 100));

      audio.onplay = () => {
        this.notify(ringtone.id);
      };

      audio.onended = () => {
        this.notify(null);
        this.currentAudio = null;
      };

      audio.onerror = () => {
        // Fallback to Web Audio synthesis if audio element fails
        this.synthesizeFallback(ringtone.id, volume);
      };

      await audio.play();
    } catch (err) {
      // Browser autoplay restriction or offline asset: synthesize via Web Audio
      this.synthesizeFallback(ringtone.id, volume);
    }
  }

  /**
   * Pure acoustic Web Audio fallback to guarantee instant acoustic preview anywhere
   */
  private synthesizeFallback(ringtoneId: string, volume: number) {
    const ctx = this.getAudioContext();
    if (!ctx) {
      this.notify(null);
      return;
    }

    this.notify(ringtoneId);
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime((volume / 100) * 0.4, now);
    masterGain.connect(ctx.destination);

    if (ringtoneId === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.4);
      setTimeout(() => this.notify(null), 1400);
    } else if (ringtoneId === 'digital') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.setValueAtTime(1046.5, now);
      osc2.frequency.setValueAtTime(1318.5, now + 0.12);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.1);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.35);
      setTimeout(() => this.notify(null), 360);
    } else if (ringtoneId === 'waterdrop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.15);
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
      setTimeout(() => this.notify(null), 400);
    } else {
      // Default / chime / melody dual tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880.0, now + 0.12);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.7);
      setTimeout(() => this.notify(null), 700);
    }
  }

  public getRingtoneById(id: string): RingtoneItem {
    return RINGTONE_OPTIONS.find(r => r.id === id) || RINGTONE_OPTIONS[0];
  }
}

export const soundStudio = new SoundStudioService();
