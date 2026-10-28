/**
 * HER LIFE — Resilient Multilingual Voice Pipeline
 * High-fidelity, audible TTS playback across Android WebView, mobile browsers, and desktop.
 * Combines Backend TTS, Cloud Audio Stream, and Web Speech API fallback with gesture unlocking.
 */

import { API_BASE } from './api';

export interface VoiceStateListener {
  (isSpeaking: boolean, currentMessageId?: string | null): void;
}

class VoicePipelineService {
  private audioElement: HTMLAudioElement | null = null;
  private isSpeakingState: boolean = false;
  private currentMessageId: string | null = null;
  private listeners: Set<VoiceStateListener> = new Set();
  private userGestureUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (!this.audioElement && typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.autoplay = false;

      audio.onplay = () => {
        this.setSpeaking(true);
      };

      audio.onended = () => {
        this.setSpeaking(false);
      };

      audio.onerror = (e) => {
        console.warn('Audio element error, falling back:', e);
        this.setSpeaking(false);
      };

      this.audioElement = audio;
    }
  }

  /**
   * Must be called during user click/touch to unlock mobile audio autoplay restrictions
   */
  public primeUserGesture(): void {
    if (typeof window === 'undefined') return;
    this.userGestureUnlocked = true;

    if (!this.audioElement) {
      this.initAudioElement();
    }

    // Play a silent 0-byte buffer to prime Android WebView & iOS Safari
    if (this.audioElement) {
      try {
        const silentDataUri = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.audioElement.src = silentDataUri;
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
              }
            })
            .catch(() => {
              // Ignore priming aborts
            });
        }
      } catch (e) {
        // ignore
      }
    }
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingState, this.currentMessageId);
    return () => this.listeners.delete(listener);
  }

  private setSpeaking(speaking: boolean, messageId?: string | null) {
    this.isSpeakingState = speaking;
    if (!speaking) {
      this.currentMessageId = null;
    } else if (messageId !== undefined) {
      this.currentMessageId = messageId;
    }
    this.listeners.forEach(fn => fn(this.isSpeakingState, this.currentMessageId));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public stop(): void {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    this.setSpeaking(false);
  }

  public pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.setSpeaking(false);
    } else if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
      this.setSpeaking(false);
    }
  }

  public resume(): void {
    if (this.audioElement && this.audioElement.paused && this.audioElement.src) {
      this.audioElement.play().catch(() => {});
      this.setSpeaking(true);
    } else if (typeof window !== 'undefined' && window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      this.setSpeaking(true);
    }
  }

  /**
   * Main speech playback method.
   * Cleans text and tries:
   * 1. Backend /api/ai/tts
   * 2. Direct Cloud TTS audio stream
   * 3. Browser SpeechSynthesis API
   */
  public async speak(
    text: string, 
    languageCode: string = 'en', 
    messageId?: string | null
  ): Promise<boolean> {
    this.stop();

    if (!text || !text.trim()) {
      return false;
    }

    // Clean markdown, markdown bullet points, symbols & excessive whitespace
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 350);

    const langTag = this.normalizeLangTag(languageCode);
    const encodedText = encodeURIComponent(cleanText);

    this.setSpeaking(true, messageId);

    // Try Layer 1: Dedicated Backend TTS Stream
    const backendUrl = `${API_BASE}/ai/tts?text=${encodedText}&lang=${langTag}`;
    const backendSuccess = await this.playAudioUrl(backendUrl);
    if (backendSuccess) return true;

    // Try Layer 2: Direct Google Translate TTS Stream
    const cloudUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${langTag}&client=tw-ob`;
    const cloudSuccess = await this.playAudioUrl(cloudUrl);
    if (cloudSuccess) return true;

    // Try Layer 3: Web SpeechSynthesis
    const synthSuccess = this.speakViaSpeechSynthesis(cleanText, languageCode);
    if (synthSuccess) return true;

    this.setSpeaking(false);
    return false;
  }

  private playAudioUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.audioElement) {
        this.initAudioElement();
      }
      if (!this.audioElement) {
        resolve(false);
        return;
      }

      const audio = this.audioElement;
      let resolved = false;

      const cleanup = () => {
        audio.removeEventListener('playing', onPlaying);
        audio.removeEventListener('error', onError);
      };

      const onPlaying = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          this.setSpeaking(true);
          resolve(true);
        }
      };

      const onError = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      };

      audio.addEventListener('playing', onPlaying, { once: true });
      audio.addEventListener('error', onError, { once: true });

      try {
        audio.src = url;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(false);
            }
          });
        }
      } catch (err) {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }

      // Safety timeout after 2.5s if stream hangs
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }, 2500);
    });
  }

  private speakViaSpeechSynthesis(cleanText: string, langCode: string): boolean {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const speechTag = this.getBCP47Tag(langCode);
      utterance.lang = speechTag;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => 
        v.lang.toLowerCase() === speechTag.toLowerCase() ||
        v.lang.toLowerCase().startsWith(speechTag.slice(0, 2).toLowerCase())
      ) || voices.find(v => v.lang.includes('IN') || v.lang.startsWith('en')) || voices[0];

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        this.setSpeaking(true);
      };

      utterance.onend = () => {
        this.setSpeaking(false);
      };

      utterance.onerror = () => {
        this.setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      return false;
    }
  }

  private normalizeLangTag(code: string): string {
    const map: Record<string, string> = {
      hi: 'hi',
      hinglish: 'hi',
      pa: 'pa',
      bn: 'bn',
      ta: 'ta',
      te: 'te',
      mr: 'mr',
      gu: 'gu',
      kn: 'kn',
      ml: 'ml',
      ur: 'ur',
      or: 'hi',
      as: 'bn',
      en: 'en'
    };
    return map[code.toLowerCase()] || 'en';
  }

  private getBCP47Tag(code: string): string {
    const map: Record<string, string> = {
      hi: 'hi-IN',
      hinglish: 'hi-IN',
      pa: 'pa-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      ur: 'ur-IN',
      en: 'en-IN'
    };
    return map[code.toLowerCase()] || 'en-IN';
  }
}

export const voicePipeline = new VoicePipelineService();
