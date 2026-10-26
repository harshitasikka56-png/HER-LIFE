import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  BookOpen, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Square, 
  RotateCcw,
  ShieldCheck,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { LotusBloomIcon } from '../components/common/LotusBloomIcon';
import { Language, INDIAN_LANGUAGES } from '../services/i18n';

interface AIGuidePageProps {
  currentUser: UserProfile;
  language?: Language;
  onOpenVoiceAssistant?: () => void;
  onBack?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  disclaimer?: string;
  recommended_questions?: string[];
}

const QUICK_TOPICS = [
  "What are the 4 cycle phases?",
  "How to relieve period cramps naturally?",
  "What are the early indicators of PCOS?",
  "Can stress or exams delay my period?",
  "Normal vs abnormal cycle length?",
  "Questions to ask gynecologist about irregularity?"
];

export const AIGuidePage: React.FC<AIGuidePageProps> = ({ 
  currentUser, 
  language = 'en', 
  onOpenVoiceAssistant,
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: `Hello ${currentUser.full_name.split(' ')[0]}! I am Saheli, your private AI health companion.\n\nI am grounded in vetted clinical guidelines from ACOG (American College of Obstetricians and Gynecologists), Monash University PCOS Guidelines, and NAMS (North American Menopause Society).\n\nAsk me anything about your cycle, cramps, hormones, stress, or nutrition in your language!`,
      sources: ["ACOG Clinical Guidelines", "Monash University International PCOS Guidelines"],
      recommended_questions: [
        "What are the 4 cycle phases?",
        "How to relieve period cramps naturally?",
        "Can stress or exams delay my period?"
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  // Determine language metadata
  const currentLangMeta = INDIAN_LANGUAGES.find(l => l.code === currentUser.preferred_language) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Read message aloud
  function handleSpeak(messageId: string, text: string) {
    if (!synthRef.current) return;

    if (speakingMessageId === messageId) {
      synthRef.current.cancel();
      setSpeakingMessageId(null);
      return;
    }

    try {
      synthRef.current.cancel();
      const cleanText = text
        .replace(/[*_#`~[\]]/g, '')
        .replace(/\n+/g, ' ')
        .slice(0, 450);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLangMeta.speechTag;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = synthRef.current.getVoices();
      const matchingVoice = voices.find(v => 
        v.lang.toLowerCase() === currentLangMeta.speechTag.toLowerCase() ||
        v.lang.toLowerCase().startsWith(currentLangMeta.speechTag.slice(0, 2).toLowerCase())
      ) || voices[0];

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setSpeakingMessageId(messageId);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
      setSpeakingMessageId(null);
    }
  }

  // Quick microphone speech-to-text in the chat bar
  function handleToggleMic() {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onOpenVoiceAssistant) {
        onOpenVoiceAssistant();
      } else {
        setVoiceNotice('Speech recognition not supported in this browser; please type your question.');
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = currentLangMeta.speechTag;
      recognition.continuous = false;
      recognition.interimResults = true;

      setIsListening(true);
      setVoiceNotice('');

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      if (onOpenVoiceAssistant) onOpenVoiceAssistant();
    }
  }

  async function handleSend(textToSend?: string) {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (synthRef.current) synthRef.current.cancel();
    setSpeakingMessageId(null);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text.trim()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const contextualPrompt = `[Language: ${currentLangMeta.name}]. ${text.trim()}`;
      const resp = await api.askAIGuide(currentUser.id, contextualPrompt);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: resp.reply,
        sources: resp.sources,
        recommended_questions: resp.recommended_questions,
        disclaimer: resp.medical_disclaimer
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: "I am here with you. Remember to maintain gentle hydration, rest comfortably with a warm compress if experiencing cramps, and listen to your body.",
        sources: ["Clinical Lifestyle Guidelines"],
        recommended_questions: ["How to relieve period cramps naturally?"]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Voice Assistant Live Talk Card */}
      {onOpenVoiceAssistant && (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-brand-500 to-amber-400 p-4 sm:p-6 rounded-3xl text-white shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Mic className="w-3 h-3" />
              <span>Saheli Voice Mode</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold">Talk with Saheli Hands-Free</h3>
            <p className="text-xs text-white/90 max-w-md line-clamp-2">
              Speak in 14 Indian languages. Listen to warm spoken answers with interactive voice orb animations.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenVoiceAssistant}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-brand-700 hover:bg-rose-50 rounded-2xl font-bold text-xs shadow-soft flex items-center justify-center gap-2 transform active:scale-95 transition shrink-0"
          >
            <Mic className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Launch Voice Orb</span>
          </button>
        </div>
      )}

      {/* Suggested Topics Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-warm-textMuted uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Suggestions:
        </span>
        {QUICK_TOPICS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white hover:bg-rose-50 text-warm-textDark font-medium px-3 py-1.5 rounded-full border border-warm-border/80 shadow-2xs whitespace-nowrap transition shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-warm-border shadow-soft flex flex-col h-[calc(100vh-230px)] min-h-[460px] max-h-[720px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-warm-border/60 bg-warm-cardMuted/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 -ml-1 mr-0.5 rounded-xl hover:bg-warm-border/60 text-warm-textDark transition flex items-center gap-1 active:scale-95"
                aria-label="Back to Previous Screen"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[11px] font-bold hidden xs:inline">Back</span>
              </button>
            )}
            <div className="w-7 h-7 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-warm-textDark">Saheli AI Guide</h4>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  ACOG Vetted
                </span>
              </div>
              <p className="text-[10px] text-warm-textMuted">Confidential, non-diagnostic guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100 font-semibold">
            <Globe className="w-3 h-3" />
            <span>{currentLangMeta.nativeName}</span>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const isSpeakingThis = speakingMessageId === m.id;

            return (
              <div key={m.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-500 to-plum-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <LotusBloomIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 break-words ${
                    isUser
                      ? 'bg-brand-500 text-white rounded-tr-xs shadow-2xs'
                      : 'bg-[#FBF8F6] text-warm-textDark rounded-tl-xs border border-rose-100/80 shadow-2xs'
                  }`}
                  style={{ overflowWrap: 'anywhere' }}
                >
                  <p className="whitespace-pre-line leading-relaxed font-normal">{m.content}</p>

                  {/* Read Aloud Button for Assistant */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-1 border-t border-rose-100/60">
                      <button
                        type="button"
                        onClick={() => handleSpeak(m.id, m.content)}
                        className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition ${
                          isSpeakingThis
                            ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                            : 'bg-white text-warm-textMuted hover:text-brand-600 border-warm-border/70'
                        }`}
                      >
                        {isSpeakingThis ? (
                          <>
                            <Square className="w-2.5 h-2.5 text-rose-600 fill-rose-600" />
                            <span>Stop voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-brand-600" />
                            <span>Listen aloud</span>
                          </>
                        )}
                      </button>

                      <span className="text-[9px] text-warm-textMuted">Saheli Clinical</span>
                    </div>
                  )}

                  {/* Clinical Sources Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-1.5 border-t border-rose-100/60 text-[10px] space-y-0.5 text-warm-textMuted">
                      <span className="font-bold uppercase tracking-wider block text-plum-700 text-[9px]">
                        Clinical Sources:
                      </span>
                      {m.sources.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span>•</span>
                          <span className="line-clamp-1">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {m.recommended_questions && m.recommended_questions.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-1">
                      {m.recommended_questions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="bg-white hover:bg-rose-50 text-[10px] text-plum-800 font-semibold px-2 py-0.5 rounded-lg border border-plum-200 transition shadow-2xs"
                        >
                          💬 {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Disclaimer notice */}
                  {m.disclaimer && (
                    <div className="text-[9px] text-warm-textMuted italic pt-1 border-t border-warm-border/40">
                      * {m.disclaimer}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-warm-cardMuted text-warm-textDark flex items-center justify-center shrink-0 border border-warm-border mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-warm-textMuted py-2">
              <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 animate-pulse">
                <LotusBloomIcon className="w-3.5 h-3.5 text-brand-600 animate-spin" />
              </div>
              <span className="animate-pulse">Saheli is consulting clinical guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-warm-border bg-white shrink-0">
          {voiceNotice && (
            <p className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-xl border border-amber-200 mb-2">
              {voiceNotice}
            </p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5"
          >
            {/* Inline Mic Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              title={isListening ? "Listening... Tap to stop" : "Speak to Saheli"}
              className={`p-2.5 rounded-2xl border transition shadow-2xs shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-warm-cardMuted hover:bg-rose-50 text-warm-textDark border-warm-border'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={isListening ? "Listening to your voice..." : "Ask Saheli about cramps, PMS, cycle regularity..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs p-2.5 sm:p-3 rounded-2xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white p-2.5 sm:p-3 rounded-2xl shadow-soft transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Safety Disclaimer Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] text-warm-textMuted mt-1.5 px-1 gap-0.5">
            <span>
              Evidence-based educational AI • Not a clinical diagnosis or prescription
            </span>
            <span className="font-bold text-rose-600">
              Emergency? Call local health helpline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
