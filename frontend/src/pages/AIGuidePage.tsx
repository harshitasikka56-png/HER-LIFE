import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { Bot, Send, Sparkles, BookOpen, User } from 'lucide-react';
import { Language } from '../services/i18n';

interface AIGuidePageProps {
  currentUser: UserProfile;
  language?: Language;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  disclaimer?: string;
  recommended_questions?: string[];
}

const SUGGESTED_PROMPTS_EN = [
  "What are the four phases of the menstrual cycle?",
  "What are common symptoms and diagnostic criteria for PCOS?",
  "Can stress delay my period or ovulation?",
  "What is the difference between normal cramps and endometriosis?",
  "What changes occur during perimenopause?",
  "What questions should I ask my gynecologist about irregular cycles?"
];

const SUGGESTED_PROMPTS_HINGLISH = [
  "Periods ke dard (cramps) ke gharelu upay kya hain?",
  "PCOS ke mukhya lakshan aur test kya hote hain?",
  "Tension ya stress se periods late kyun hote hain?",
  "Pehla period shuru hone par kya dhyan rakhein?",
  "Cycle ke 4 phases saral bhasha mein samjhaiye",
  "Doctor se irregular periods ke baare mein kya poochein?"
];

export const AIGuidePage: React.FC<AIGuidePageProps> = ({ currentUser, language = 'en' }) => {
  const isHinglish = language === 'hinglish';
  const suggestedPrompts = isHinglish ? SUGGESTED_PROMPTS_HINGLISH : SUGGESTED_PROMPTS_EN;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: isHinglish
        ? `Namaste ${currentUser.full_name.split(' ')[0]} ji! Main aapki AI Saheli (HER LIFE Guide) hoon. Main ACOG aur international clinical guidelines ke aadhar par saral Hinglish mein aapki madad ke liye taiyar hoon.\n\nPeriods, dard, PCOS, neend ya hormones se juda koi bhi sawaal bejhi-jhak poochein!`
        : `Hello ${currentUser.full_name.split(' ')[0]}! I am HER LIFE Guide, your evidence-based health education companion. I am grounded in clinical guidelines from ACOG, Monash University, and the Menopause Society.\n\nHow can I support your hormonal or menstrual health journey today?`,
      sources: ["ACOG Women's Health Knowledge Base", "Monash University PCOS Guidelines"],
      recommended_questions: suggestedPrompts.slice(0, 3)
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(textToSend?: string) {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await api.askAIGuide(currentUser.id, text);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Safeguards */}
      <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-plum-700 text-xs font-semibold uppercase tracking-wider">
            <Bot className="w-4 h-4 text-plum-600" />
            <span>{isHinglish ? 'AI Saheli Guide' : 'HER LIFE Guide'}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-warm-textDark mt-1">
            {isHinglish ? 'Saral Bhasha Mein AI Health Education' : 'Evidence-Based AI Health Education Assistant'}
          </h2>
          <p className="text-xs text-warm-textMuted mt-1">
            {isHinglish 
              ? 'ACOG aur clinical sources par aadharit certified gyan. Yeh koi bimari diagnose ya davai prescribe nahi karta.'
              : 'Clinically vetted reproductive health knowledge with citations. Never diagnoses, prescribes, or promises outcomes.'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-plum-50 text-plum-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-plum-200 shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-plum-600" />
          <span>{isHinglish ? 'Vetted Clinical Jaankari' : 'Vetted Clinical Sources'}</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white hover:bg-brand-50 hover:text-brand-700 text-warm-textDark font-medium px-3.5 py-2 rounded-full border border-warm-border shadow-2xs transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-warm-border shadow-soft flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-plum-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                    isUser
                      ? 'bg-brand-500 text-white rounded-tr-xs'
                      : 'bg-warm-cardMuted text-warm-textDark rounded-tl-xs border border-warm-border/60'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>

                  {/* Sources Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-2 border-t border-warm-border/60 text-[10px] space-y-1 text-warm-textMuted">
                      <span className="font-bold uppercase tracking-wider block text-plum-700">
                        {isHinglish ? 'Clinical References (Vetted Sources):' : 'Clinical References:'}
                      </span>
                      {m.sources.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {m.recommended_questions && m.recommended_questions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {m.recommended_questions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="bg-white/90 hover:bg-white text-[11px] text-plum-800 font-semibold px-2.5 py-1 rounded-lg border border-plum-200 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Disclaimer notice */}
                  {m.disclaimer && (
                    <div className="text-[10px] text-warm-textMuted italic pt-1 border-t border-warm-border/40">
                      * {m.disclaimer}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-warm-cardMuted text-warm-textDark flex items-center justify-center shrink-0 border border-warm-border">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-warm-textMuted">
              <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>
                {isHinglish ? 'AI Saheli jaankari check kar rahi hai...' : 'HER LIFE Guide is reviewing vetted health sources...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-warm-border bg-white rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={isHinglish 
                ? "Periods, pet dard, cramps, PCOS, neend ya tension ke baare mein poochein..."
                : "Ask about cycles, PMS, ovulation, symptoms, PCOS, or menopause..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs p-3 rounded-2xl border border-warm-border focus:ring-2 focus:ring-brand-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white p-3 rounded-2xl shadow-soft transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-warm-textMuted mt-2 px-1">
            <span>
              {isHinglish 
                ? 'Educational jaankari ke liye hai • Doctor ki jagah nahi le sakta'
                : 'Educational guidance only • Not medical advice or diagnosis'}
            </span>
            <span>
              {isHinglish ? 'Emergency mein turant hospital call karein' : 'Emergency? Call local medical services immediately'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
