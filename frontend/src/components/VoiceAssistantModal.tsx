import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  ShieldCheck, 
  Globe, 
  RotateCcw,
  Heart,
  Send,
  HelpCircle,
  Play,
  Pause,
  Square,
  AlertCircle
} from 'lucide-react';
import { LotusBloomIcon } from './common/LotusBloomIcon';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { INDIAN_LANGUAGES, LanguageMeta } from '../services/i18n';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'paused';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  // Find current user's preferred language or default to en
  const initialLang = INDIAN_LANGUAGES.find(l => l.code === currentUser.preferred_language) || INDIAN_LANGUAGES[0];
  const [selectedLang, setSelectedLang] = useState<LanguageMeta>(initialLang);
  const [state, setState] = useState<AssistantState>('idle');
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');

  // Speech Recognition & Synthesis references
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const finalTranscriptRef = useRef<string>('');

  // Suggested quick health prompts dynamically keyed to language
  const QUICK_QUESTIONS: Record<string, string[]> = {
    hi: [
      "पीरियड्स में पेट दर्द के आसान घरेलू उपाय क्या हैं?",
      "क्या तनाव की वजह से पीरियड लेट हो सकता है?",
      "PCOS के शुरुआती लक्षण क्या होते हैं?",
      "ओवुलेशन और फर्टाइल विंडो कैसे पहचानें?"
    ],
    hinglish: [
      "Period cramps kam karne ke best home remedies?",
      "Kya stress se period cycle delay ho sakti hai?",
      "PCOS aur PCOD ke main symptoms kya hain?",
      "Normal cycle kitne din ki honi chahiye?"
    ],
    pa: [
      "ਮਾਹਵਾਰੀ ਦੇ ਦਰਦ ਤੋਂ ਰਾਹਤ ਲਈ ਘਰੇਲੂ ਨੁਸਖੇ ਕੀ ਹਨ?",
      "ਕੀ ਤਣਾਅ ਕਾਰਨ ਮਾਹਵਾਰੀ ਲੇਟ ਹੋ ਸਕਦੀ ਹੈ?",
      "PCOS ਦੇ ਮੁੱਖ ਲੱਛਣ ਕੀ ਹਨ?",
      "ਸਿਹਤਮੰਦ ਚੱਕਰ ਕਿੰਨੇ ਦਿਨਾਂ ਦਾ ਹੁੰਦਾ ਹੈ?"
    ],
    bn: [
      "মাসিকের তীব্র পেটে ব্যথার সেরা ঘরোয়া প্রতিকার কি?",
      "মানসিক চাপের কারণে কি মাসিক দেরিতে হতে পারে?",
      "পিসিওএস (PCOS)-এর প্রাথমিক লক্ষণগুলি কি?",
      "স্বাভাবিক মাসিক চক্র কতদিনের হয়?"
    ],
    ta: [
      "மாதவிடாய் வயிற்று வலியை குறைக்க எளிய வீட்டு வைத்தியம் என்ன?",
      "மன அழுத்தத்தால் மாதவிடாய் தள்ளிப்போகுமா?",
      "PCOS-ன் முக்கிய அறிகுறிகள் என்ன?",
      "சராசரி மாதவிடாய் சுழற்சி எத்தனை நாட்கள்?"
    ],
    te: [
      "పీరియడ్స్ కడుపు నొప్పికి ఉత్తమమైన చిట్కాలు ఏమిటి?",
      "ఒత్తిడి వల్ల పీరియడ్స్ ఆలస్యం కావచ్చా?",
      "PCOS యొక్క ప్రారంభ లక్షణాలు ఏమిటి?",
      "సాధారణ ఋతు చక్రం ఎన్ని రోజులు ఉంటుంది?"
    ],
    mr: [
      "मासिक पाळीतील पोटदुखीसाठी घरगुती उपाय कोणते आहेत?",
      "ताणामुळे मासिक पाळी उशिरा येऊ शकते का?",
      "PCOS ची मुख्य लक्षणे कोणती आहेत?",
      "निरोगी मासिक पाळीचे चक्र किती दिवसांचे असते?"
    ],
    gu: [
      "માસિકમાં પેટના દુખાવા માટેના શ્રેષ્ઠ ઉપાયો શું છે?",
      "શું તણાવને કારણે માસિક મોડું આવી શકે છે?",
      "PCOS ના પ્રારંભિક લક્ષણો શું છે?",
      "સામાન્ય માસિક ચક્ર કેટલા દિવસનું હોય છે?"
    ],
    kn: [
      "ಮುಟ್ಟಿನ ಹೊಟ್ಟೆ ನೋವಿಗೆ ಸುಲಭ ಮನೆಮದ್ದುಗಳು ಯಾವುವು?",
      "ಒತ್ತಡದಿಂದ ಮುಟ್ಟು ವಿಳಂಬವಾಗಬಹುದೇ?",
      "PCOS ನ ಆರಂಭಿಕ ಲಕ್ಷಣಗಳು ಯಾವುವು?",
      "ಸಾಮಾನ್ಯ ಮುಟ್ಟಿನ ಚಕ್ರ ಎಷ್ಟು ದಿನಗಳಿರುತ್ತದೆ?"
    ],
    ml: [
      "ആർത്തവ വേദന കുറയ്ക്കാൻ ഉള്ള ലളിതമായ വഴികൾ എന്തൊക്കെയാണ്?",
      "മാനസിക സമ്മർദ്ദം കാരണം ആർത്തവം വൈകുമോ?",
      "പി.സി.ഒ.എസ് (PCOS) ലക്ഷണങ്ങൾ എന്തൊക്കെയാണ്?",
      "സാധാരണ ആർത്തവ ചക്രം എത്ര ദിവസമാണ്?"
    ],
    or: [
      "ଋତୁସ୍ରାବ ପେଟ ଯନ୍ତ୍ରଣାରୁ ମୁକ୍ତି ପାଇଁ ଘରୋଇ ଉପଚାର କ'ଣ?",
      "ମାନସିକ ଚାପ ଯୋଗୁଁ ପିରିୟଡ୍ ବିଳମ୍ବ ହୋଇପାରେ କି?",
      "PCOS ର ପ୍ରାରମ୍ଭିକ ଲକ୍ଷଣ କ'ଣ?",
      "ଏକ ସାଧାରଣ ଋତୁଚକ୍ର କେତେ ଦିନର ହୋଇଥାଏ?"
    ],
    ur: [
      "ماہواری کے درد کو کم کرنے کے گھریلو طریقے کیا ہیں؟",
      "کیا ذہنی دباؤ سے ماہواری میں تاخیر ہو سکتی ہے؟",
      "PCOS کی ابتدائی علامات کیا ہیں؟",
      "صحت مند ماہواری کا دورانیہ کتنے دن کا ہوتا ہے؟"
    ],
    as: [
      "ঋতুস্ৰাৱৰ পেটৰ বিষ উপশম কৰাৰ ঘৰুৱা উপায় কি?",
      "মানসিক চাপৰ বাবে মাহেকীয়া পলম হ'ব পাৰেনে?",
      "PCOS ৰ প্ৰধান লক্ষণসমূহ কি কি?",
      "এটা স্বাভাৱিক ঋতুচক্ৰ কিমান দিনৰ হয়?"
    ],
    en: [
      "What are the best safe home remedies for period cramps?",
      "Can high stress or exams delay my period cycle?",
      "What are the early indicators of PCOS to track?",
      "How do I recognize my fertile window and ovulation?"
    ]
  };

  const currentQuestions = QUICK_QUESTIONS[selectedLang.code] || QUICK_QUESTIONS['en'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAssistantReply(selectedLang.greeting);
      setTranscript('');
      setErrorMessage('');
      setVoiceNotice('');
      setState('idle');
    } else {
      stopAllAudio();
    }
  }, [isOpen, selectedLang]);

  function stopAllAudio() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (e) {
        // ignore
      }
    }
  }

  // Request microphone permission gracefully
  async function requestMicPermission(): Promise<boolean> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn("Microphone access error:", err);
      setPermissionGranted(false);
      setErrorMessage("Microphone permission was denied. You can still type your questions below or use the quick questions.");
      setState('idle');
      return false;
    }
  }

  // Speak text aloud using Web Speech API
  function speak(text: string) {
    if (isMuted || !synthRef.current) return;

    try {
      synthRef.current.cancel();

      // Clean markdown symbols for natural human speech
      const cleanText = text
        .replace(/[*_#`~[\]]/g, '')
        .replace(/\n+/g, ' ')
        .slice(0, 400);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      currentUtteranceRef.current = utterance;
      utterance.lang = selectedLang.speechTag;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = synthRef.current.getVoices();
      // Match voice by language speechTag
      const matchingVoice = voices.find(v => 
        v.lang.toLowerCase() === selectedLang.speechTag.toLowerCase() ||
        v.lang.toLowerCase().startsWith(selectedLang.speechTag.slice(0, 2).toLowerCase())
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

      if (matchingVoice) {
        utterance.voice = matchingVoice;
        setVoiceNotice('');
      } else {
        setVoiceNotice(`Spoken voice not installed on device for ${selectedLang.name}; showing text response.`);
      }

      utterance.onstart = () => {
        setState('speaking');
      };

      utterance.onend = () => {
        setState('idle');
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        setState('idle');
      };

      synthRef.current.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed", e);
      setState('idle');
    }
  }

  function handlePauseSpeech() {
    if (synthRef.current && state === 'speaking') {
      synthRef.current.pause();
      setState('paused');
    }
  }

  function handleResumeSpeech() {
    if (synthRef.current && state === 'paused') {
      synthRef.current.resume();
      setState('speaking');
    }
  }

  function handleStopSpeech() {
    stopAllAudio();
    setState('idle');
  }

  function handleReplaySpeech() {
    if (assistantReply) {
      speak(assistantReply);
    }
  }

  // Start speech recognition in selected language tag
  async function startListening() {
    stopAllAudio();
    setErrorMessage('');
    setVoiceNotice('');

    if (permissionGranted !== true) {
      const allowed = await requestMicPermission();
      if (!allowed) return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser. Please use Chrome, Edge, or type your question below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = selectedLang.speechTag;
      recognition.continuous = false;
      recognition.interimResults = true;

      finalTranscriptRef.current = '';
      setState('listening');
      setTranscript('');

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        finalTranscriptRef.current = currentTranscript;
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        const spoken = finalTranscriptRef.current.trim();
        if (spoken) {
          processVoiceQuery(spoken);
        } else {
          setState('idle');
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Listening notice: ${event.error}. You can also type or choose a question below.`);
        }
        setState('idle');
      };

      recognition.start();
    } catch (e: any) {
      console.error("Recognition start failed:", e);
      setErrorMessage("Could not initialize voice listener. You can type your query below.");
      setState('idle');
    }
  }

  // Process query through AI backend
  async function processVoiceQuery(queryText: string) {
    if (!queryText.trim()) return;

    setState('thinking');
    setTranscript(queryText);

    try {
      const contextualPrompt = `[Language: ${selectedLang.name} (${selectedLang.nativeName})]. The user asks in their language: "${queryText}". Provide a warm, empathetic, medically sound response in 2-3 sentences in the same language (${selectedLang.name}).`;
      
      const response = await api.askAIGuide(currentUser.id, contextualPrompt);
      const reply = response.reply || selectedLang.greeting;
      setAssistantReply(reply);
      speak(reply);
    } catch (err) {
      console.error("AI voice query error:", err);
      const fallbackReply = selectedLang.code === 'hi'
        ? "माफ़ कीजिए, अभी सर्वर से संपर्क नहीं हो पाया। पीरियड्स के दौरान आराम करें, पर्याप्त पानी पिएं और हीटिंग पैड का उपयोग करें।"
        : "I am having trouble connecting right now, but remember to stay hydrated, rest comfortably, and use a warm compress if experiencing cramps.";
      setAssistantReply(fallbackReply);
      speak(fallbackReply);
    }
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput.trim();
    setTextInput('');
    processVoiceQuery(q);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white via-[#FCF8F7] to-[#FAF3F0] rounded-t-[32px] sm:rounded-[36px] shadow-2xl border border-rose-200/80 overflow-hidden flex flex-col h-[93vh] sm:h-[86vh] max-h-[93vh]">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 flex items-center justify-between border-b border-rose-100/70 shrink-0 bg-white/90 backdrop-blur-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-brand-500 via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-soft shrink-0">
              <LotusBloomIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-serif font-bold text-base sm:text-lg text-warm-textDark truncate">Saheli Voice AI</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full shrink-0">
                  14 Languages
                </span>
              </div>
              <p className="text-[11px] text-warm-textMuted flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Two-way multilingual voice companion</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mute Voice toggle */}
            <button
              onClick={() => {
                if (state === 'speaking') synthRef.current?.cancel();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
              className={`p-2 rounded-full border transition active:scale-95 ${
                isMuted ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-white text-warm-textMuted border-warm-border hover:bg-rose-50'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white hover:bg-rose-100 text-warm-textMuted hover:text-warm-textDark border border-warm-border transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 14 Languages Selector Scroll Strip */}
        <div className="px-3.5 sm:px-6 py-2 bg-rose-50/70 border-b border-rose-100/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-warm-textMuted font-bold shrink-0">
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            <span>Language:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {INDIAN_LANGUAGES.map((l) => {
              const isSelected = selectedLang.code === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    stopAllAudio();
                    setSelectedLang(l);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-soft'
                      : 'bg-white text-warm-textDark hover:bg-rose-50 border border-rose-100'
                  }`}
                >
                  <span>{l.nativeName}</span>
                  <span className={`text-[10px] ml-1 opacity-80 ${isSelected ? 'text-rose-100' : 'text-warm-textMuted'}`}>
                    ({l.name.split(' ')[0]})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Middle Conversation & Voice Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 space-y-3.5 no-scrollbar flex flex-col items-center">
          
          {/* Animated Central Voice Orb */}
          <div className="relative flex flex-col items-center justify-center pt-1 shrink-0">
            <div className="relative flex items-center justify-center">
              <div 
                className={`absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full transition-all duration-700 ${
                  state === 'listening'
                    ? 'bg-gradient-to-r from-rose-400/40 via-brand-400/30 to-amber-300/40 animate-ping scale-110'
                    : state === 'speaking'
                    ? 'bg-gradient-to-r from-plum-400/30 via-rose-300/30 to-brand-400/40 animate-pulse scale-105'
                    : state === 'thinking'
                    ? 'bg-gradient-to-r from-amber-300/30 via-brand-300/30 to-rose-300/30 animate-spin'
                    : 'bg-rose-200/20'
                }`}
              />

              <div 
                className={`absolute w-24 h-24 sm:w-26 sm:h-26 rounded-full blur-sm transition-all duration-500 ${
                  state === 'listening'
                    ? 'bg-rose-400/40 scale-105'
                    : state === 'speaking'
                    ? 'bg-brand-400/40 scale-105'
                    : 'bg-rose-200/30'
                }`}
              />

              {/* Central Orb Button (Tap to talk / stop) */}
              <button
                type="button"
                onClick={() => {
                  if (state === 'speaking') {
                    synthRef.current?.cancel();
                    setState('idle');
                  } else if (state === 'listening') {
                    if (recognitionRef.current) recognitionRef.current.stop();
                  } else {
                    startListening();
                  }
                }}
                className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-white shadow-glow transition-all duration-300 transform active:scale-95 ${
                  state === 'listening'
                    ? 'bg-gradient-to-tr from-rose-500 via-brand-500 to-amber-400 ring-4 ring-rose-200/70 scale-105 animate-pulse'
                    : state === 'speaking'
                    ? 'bg-gradient-to-tr from-plum-600 via-rose-500 to-brand-500 ring-4 ring-plum-200/70'
                    : state === 'thinking'
                    ? 'bg-gradient-to-tr from-amber-500 via-brand-500 to-rose-500 ring-4 ring-amber-200/70 animate-bounce'
                    : 'bg-gradient-to-tr from-brand-600 via-rose-400 to-rose-300 hover:scale-105'
                }`}
              >
                {state === 'listening' ? (
                  <>
                    <Mic className="w-7 h-7 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Listening</span>
                  </>
                ) : state === 'speaking' ? (
                  <>
                    <Volume2 className="w-7 h-7 animate-bounce" />
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Stop Audio</span>
                  </>
                ) : state === 'thinking' ? (
                  <>
                    <LotusBloomIcon className="w-7 h-7 text-white animate-spin" />
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Thinking</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-7 h-7" />
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Tap to Talk</span>
                  </>
                )}
              </button>
            </div>

            {/* Sound Wave Animation */}
            <div className="flex items-center gap-1.5 h-4 mt-2">
              {[35, 70, 50, 85, 60, 75, 45, 90, 65, 80, 45].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    state === 'listening'
                      ? 'bg-rose-500 animate-pulse'
                      : state === 'speaking'
                      ? 'bg-brand-500 animate-bounce'
                      : 'bg-rose-200/70 h-1.5'
                  }`}
                  style={{
                    height: state === 'listening' || state === 'speaking' ? `${(h * 0.18) + 4}px` : '4px',
                    animationDelay: `${idx * 0.08}s`
                  }}
                />
              ))}
            </div>

            {/* Voice Control Buttons (Pause, Resume, Stop, Replay) */}
            {(state === 'speaking' || state === 'paused' || assistantReply) && (
              <div className="flex items-center justify-center gap-2 pt-1.5">
                {state === 'speaking' && (
                  <button
                    type="button"
                    onClick={handlePauseSpeech}
                    className="px-3 py-1 rounded-full bg-white border border-rose-200 text-warm-textDark text-[11px] font-semibold hover:bg-rose-50 flex items-center gap-1 shadow-2xs"
                  >
                    <Pause className="w-3 h-3 text-brand-600" />
                    <span>Pause</span>
                  </button>
                )}
                {state === 'paused' && (
                  <button
                    type="button"
                    onClick={handleResumeSpeech}
                    className="px-3 py-1 rounded-full bg-brand-500 text-white text-[11px] font-semibold hover:bg-brand-600 flex items-center gap-1 shadow-2xs"
                  >
                    <Play className="w-3 h-3" />
                    <span>Resume</span>
                  </button>
                )}
                {(state === 'speaking' || state === 'paused') && (
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="px-3 py-1 rounded-full bg-white border border-rose-200 text-warm-textDark text-[11px] font-semibold hover:bg-rose-50 flex items-center gap-1 shadow-2xs"
                  >
                    <Square className="w-3 h-3 text-rose-500" />
                    <span>Stop</span>
                  </button>
                )}
                {assistantReply && state === 'idle' && (
                  <button
                    type="button"
                    onClick={handleReplaySpeech}
                    className="px-3 py-1 rounded-full bg-white border border-rose-200 text-brand-700 text-[11px] font-semibold hover:bg-rose-50 flex items-center gap-1 shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3 text-brand-600" />
                    <span>Replay Audio</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Conversation Stream */}
          <div className="w-full space-y-2.5">
            {/* Realtime User Transcript */}
            {transcript && (
              <div className="p-3 bg-white rounded-2xl border border-rose-200 shadow-2xs text-xs text-warm-textDark text-left">
                <span className="font-bold text-brand-600">You ({selectedLang.nativeName}): </span>
                <span className="italic">"{transcript}"</span>
              </div>
            )}

            {/* Assistant Reply Card */}
            {assistantReply && (
              <div className="p-3.5 sm:p-4 bg-gradient-to-br from-rose-50/90 to-brand-50/50 rounded-2xl border border-rose-200/80 text-xs sm:text-sm text-warm-textDark text-left leading-relaxed shadow-soft">
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 mb-1.5 pb-1 border-b border-rose-100">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>Saheli ({selectedLang.nativeName}):</span>
                  </span>
                  {state === 'speaking' && (
                    <span className="text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded-full border border-brand-200 animate-pulse">
                      Speaking aloud...
                    </span>
                  )}
                </div>
                <p className="font-normal text-warm-textDark leading-relaxed">{assistantReply}</p>
              </div>
            )}

            {/* Voice notice / fallback banner */}
            {voiceNotice && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 text-left flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span>{voiceNotice}</span>
              </div>
            )}

            {/* Error Display */}
            {errorMessage && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-left">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Quick Questions Grid */}
          <div className="w-full text-left space-y-2 pt-1 pb-1">
            <div className="flex items-center justify-between text-xs text-warm-textMuted font-medium">
              <span className="flex items-center gap-1 font-semibold text-warm-textDark">
                <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
                Suggested questions in {selectedLang.nativeName}:
              </span>
              <button
                onClick={() => {
                  stopAllAudio();
                  setTranscript('');
                  setAssistantReply(selectedLang.greeting);
                  setState('idle');
                }}
                className="hover:text-brand-600 flex items-center gap-1 text-[11px] font-semibold text-brand-500"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => processVoiceQuery(q)}
                  className="text-left text-xs p-2.5 rounded-xl bg-white hover:bg-rose-50/80 border border-warm-border hover:border-rose-300 text-warm-textDark transition shadow-2xs hover:shadow-soft active:scale-98"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pinned Bottom Input Bar */}
        <div className="p-3 sm:px-6 bg-white/95 backdrop-blur-xs border-t border-rose-100 shrink-0 space-y-2 safe-pb">
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={selectedLang.placeholder || `Ask Saheli in ${selectedLang.name}...`}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-warm-cardMuted border border-warm-border text-xs sm:text-sm focus:ring-2 focus:ring-brand-400 focus:bg-white outline-none transition"
            />
            <button
              type="button"
              onClick={() => {
                if (state === 'listening') {
                  recognitionRef.current?.stop();
                } else {
                  startListening();
                }
              }}
              className={`p-2.5 rounded-2xl text-white transition shadow-2xs active:scale-95 ${
                state === 'listening' ? 'bg-rose-600 animate-pulse ring-2 ring-rose-300' : 'bg-rose-500 hover:bg-rose-600'
              }`}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white transition shadow-2xs active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-warm-textMuted px-1">
            <span>Hands-free voice in 14 Indian languages</span>
            <span className="font-semibold text-brand-600">HerLife Companion</span>
          </div>
        </div>

      </div>
    </div>
  );
};
