/**
 * HER LIFE — Saheli Shared Conversation Memory
 * Synchronizes voice and text conversations across the app.
 */

export interface SaheliMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: 'voice' | 'text';
  languageCode: string;
  timestamp: string;
  sources?: string[];
  recommended_questions?: string[];
}

const STORAGE_KEY = 'her_life_saheli_memory_v2';

class SaheliMemoryService {
  private messages: SaheliMessage[] = [];
  private listeners: Set<(messages: SaheliMessage[]) => void> = new Set();

  constructor() {
    this.messages = this.load();
  }

  private load(): SaheliMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load Saheli conversation history:', e);
    }
    return [];
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      // Keep last 40 messages to prevent unbounded growth
      const trimmed = this.messages.slice(-40);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      this.listeners.forEach(fn => fn([...this.messages]));
    } catch (e) {
      console.warn('Could not save Saheli conversation history:', e);
    }
  }

  public getMessages(): SaheliMessage[] {
    return [...this.messages];
  }

  public addMessage(msg: Omit<SaheliMessage, 'id' | 'timestamp'>): SaheliMessage {
    const fullMsg: SaheliMessage = {
      ...msg,
      id: `saheli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    this.messages.push(fullMsg);
    this.save();
    return fullMsg;
  }

  public clearHistory() {
    this.messages = [];
    this.save();
  }

  public subscribe(listener: (messages: SaheliMessage[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.messages]);
    return () => this.listeners.delete(listener);
  }

  public getContextSummary(limit: number = 3): string {
    const recent = this.messages.slice(-limit * 2);
    if (recent.length === 0) return '';
    return recent
      .map(m => `${m.role === 'user' ? 'User' : 'Saheli'}: ${m.content.slice(0, 150)}`)
      .join('\n');
  }
}

export const saheliMemory = new SaheliMemoryService();
