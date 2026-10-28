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
  AlertCircle,
  Settings,
  Sparkles,
  Radio,
  Sliders,
  Check,
  ChevronDown
} from 'lucide-react';
import { LotusBloomIcon } from './common/LotusBloomIcon';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { INDIAN_LANGUAGES, LanguageMeta } from '../services/i18n';
import { saheliMemory, SaheliMessage } from '../services/saheliMemory';
import { voicePipeline } from '../services/voicePipeline';
import { useBackHandler } from '../services/backNavigation';

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
  // Language selection
  const initialLang = INDIAN_LANGUAGES.find(l => l.code === currentUser.preferred_language) || INDIAN_LANGUAGES[0];
  const [selectedLang, setSelectedLang] = useState<LanguageMeta>(initialLang);
  const [autoDetectedLangName, setAutoDetectedLangName] = useState<string>('');

  // Assistant states
  const [state, setState] = useState<AssistantState>('idle');
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');
  
  // Settings & Controls
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [readAloudText, setReadAloudText] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [speechPitch, setSpeechPitch] = useState<number>(1.05);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  
  // Conversation history synchronized
  const [messages, setMessages] = useState<SaheliMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition & Synthesis references
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const isVoiceTurnRef = useRef<boolean>(false);

  // Quick prompt questions keyed to language
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
      "ଋତୁସ୍ରାବ ପେଟ ଯନ୍ତ୍ରଣାରୁ ମୁକ୍ତି ପାଇଁ ଘରୋଇ ଉପଚਾਰ କ'ଣ?",
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
      "ঋতুস্ৰাৱৰ পেটৰ বিষ উপশম কৰাৰ ঘৰুৱਾ উপায় কি?",
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

  // Android back button handling
  useBackHandler(
    'voice_assistant_modal',
    85,
    () => {
      if (isOpen) {
        stopAllAudio();
        onClose();
        return true;
      }
      return false;
    },
    isOpen
  );

  // Initialize SpeechSynthesis and voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        if (synthRef.current) {
          const vList = synthRef.current.getVoices();
          setAvailableVoices(vList);
        }
      };
      loadVoices();
      if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Subscribe to shared Saheli conversation memory
  useEffect(() => {
    const unsub = saheliMemory.subscribe((hist) => {
      setMessages(hist);
    });
    return () => unsub();
  }, []);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setAssistantReply(selectedLang.greeting);
      setTranscript('');
      setErrorMessage('');
      setVoiceNotice('');
      setState('idle');
      isVoiceTurnRef.current = false;
    } else {
      stopAllAudio();
    }
  }, [isOpen, selectedLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  function stopAllAudio() {
    voicePipeline.stop();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
  }

  // Subscribe to voicePipeline speaking state
  useEffect(() => {
    const unsub = voicePipeline.subscribe((isSpeaking) => {
      if (isSpeaking) {
        setState('speaking');
      } else if (state === 'speaking') {
        setState('idle');
      }
    });
    return () => unsub();
  }, [state]);

  // Language auto-detection engine
  function autoDetectLanguage(text: string): LanguageMeta | null {
    if (!text.trim()) return null;

    // Check Indic scripts
    if (/[\u0A00-\u0A7F]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'pa') || null;
    }
    if (/[\u0900-\u097F]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'hi') || null;
    }
    if (/[\u0980-\u09FF]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'bn') || null;
    }
    if (/[\u0B80-\u0BFF]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'ta') || null;
    }
    if (/[\u0C00-\u0C7F]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'te') || null;
    }
    if (/[\u0A80-\u0AFF]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'gu') || null;
    }
    if (/[\u0C80-\u0CFF]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'kn') || null;
    }
    if (/[\u0D00-\u0D7F]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'ml') || null;
    }
    if (/[\u0600-\u06FF]/.test(text)) {
      return INDIAN_LANGUAGES.find(l => l.code === 'ur') || null;
    }

    // Hinglish keywords in Roman script
    const hinglishMarkers = [
      /\b(kya|kyun|kaise|dard|pet|karein|batao|saheli|paani|hota|hai|nahi|kuch|chahiye|gharelu|upay|aaram)\b/i
    ];
    if (hinglishMarkers.some(re => re.test(text))) {
      return INDIAN_LANGUAGES.find(l => l.code === 'hinglish') || null;
    }

    return null;
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
      console.warn("Microphone access permission error:", err);
      setPermissionGranted(false);
      setErrorMessage("Microphone access was denied. You can continue speaking by enabling permission in Android App Settings, or chat using text below.");
      setState('idle');
      return false;
    }
  }

  // Speak text aloud using resilient Voice Pipeline (Cloud TTS / Backend / SpeechSynthesis)
  function speak(text: string, forceLanguage?: LanguageMeta) {
    if (isMuted) return;

    const langToUse = forceLanguage || selectedLang;
    setState('speaking');
    voicePipeline.speak(text, langToUse.code);
  }

  // Interrupt Saheli and start listening to user's follow-up immediately
  function handleInterrupt() {
    voicePipeline.stop();
    stopAllAudio();
    startListening();
  }

  function handlePauseSpeech() {
    voicePipeline.pause();
    setState('paused');
  }

  function handleResumeSpeech() {
    voicePipeline.resume();
    setState('speaking');
  }

  function handleStopSpeech() {
    voicePipeline.stop();
    stopAllAudio();
    setState('idle');
  }

  function handleReplaySpeech() {
    if (assistantReply) {
      speak(assistantReply);
    }
  }

  // Start two-way voice recognition
  async function startListening() {
    voicePipeline.primeUserGesture();
    stopAllAudio();
    setErrorMessage('');
    setVoiceNotice('');
    setAutoDetectedLangName('');
    isVoiceTurnRef.current = true;

    if (permissionGranted !== true) {
      const allowed = await requestMicPermission();
      if (!allowed) return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser. Please use Chrome, Edge, or type your query in the box below.");
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
        let interim = '';
        for (let i = 0; i < event.results.length; i++) {
          interim += event.results[i][0].transcript;
        }
        finalTranscriptRef.current = interim;
        setTranscript(interim);

        // Real-time language auto-detection check
        const detected = autoDetectLanguage(interim);
        if (detected && detected.code !== selectedLang.code) {
          setSelectedLang(detected);
          setAutoDetectedLangName(detected.name);
        }
      };

      recognition.onend = () => {
        const spoken = finalTranscriptRef.current.trim();
        if (spoken) {
          processQuery(spoken, true);
        } else {
          setState('idle');
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Notice: ${event.error}. You can also type or choose a question below.`);
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

  // Process query through AI backend with multi-turn context
  async function processQuery(queryText: string, fromVoice: boolean) {
    if (!queryText.trim()) return;

    // Check if user input triggered auto-detection
    const detected = autoDetectLanguage(queryText);
    const activeLang = detected || selectedLang;
    if (detected && detected.code !== selectedLang.code) {
      setSelectedLang(detected);
      setAutoDetectedLangName(detected.name);
    }

    setState('thinking');
    setTranscript(queryText);

    // Save user turn to conversation history
    saheliMemory.addMessage({
      role: 'user',
      content: queryText,
      mode: fromVoice ? 'voice' : 'text',
      languageCode: activeLang.code
    });

    try {
      // Build context summary from memory
      const contextSummary = saheliMemory.getContextSummary(2);
      const contextualPrompt = contextSummary
        ? `[Conversation context:\n${contextSummary}\n]\nUser's question in ${activeLang.name}: "${queryText}". Provide a warm, empathetic, medically sound response in 2-3 sentences in the same language (${activeLang.name}).`
        : `[Language: ${activeLang.name} (${activeLang.nativeName})]. User asks: "${queryText}". Provide a warm, empathetic, medically sound response in 2-3 sentences in the same language.`;

      const response = await api.askAIGuide(currentUser.id, contextualPrompt);
      const reply = response.reply || activeLang.greeting;
      setAssistantReply(reply);

      // Save assistant reply to shared memory
      saheliMemory.addMessage({
        role: 'assistant',
        content: reply,
        mode: fromVoice ? 'voice' : 'text',
        languageCode: activeLang.code,
        sources: response.sources
      });

      // Voice response behavior:
      // - If fromVoice: ALWAYS speak response
      // - If fromText: ONLY speak if readAloudText is enabled
      if (fromVoice || readAloudText) {
        speak(reply, activeLang);
      } else {
        setState('idle');
      }

    } catch (err) {
      console.error("AI voice query error:", err);
      const fallbackReply = activeLang.code === 'hi'
        ? "माफ़ कीजिए, अभी सर्वर से संपर्क नहीं हो पाया। पीरियड्स के दौरान आराम करें, पर्याप्त पानी पिएं और हीटिंग पैड का उपयोग करें।"
        : activeLang.code === 'pa'
        ? "ਮਾਫ਼ ਕਰਨਾ, ਇਸ ਸਮੇਂ ਸਰਵਰ ਨਾਲ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਗੁਣਗੁਣਾ ਪਾਣੀ ਪੀਓ ਅਤੇ ਆਰਾਮ ਕਰੋ।"
        : "I am having trouble connecting right now, but remember to stay hydrated, rest comfortably, and use a warm compress if experiencing cramps.";
      
      setAssistantReply(fallbackReply);

      saheliMemory.addMessage({
        role: 'assistant',
        content: fallbackReply,
        mode: fromVoice ? 'voice' : 'text',
        languageCode: activeLang.code
      });

      if (fromVoice || readAloudText) {
        speak(fallbackReply, activeLang);
      } else {
        setState('idle');
      }
    }
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!textInput.trim()) return;
    voicePipeline.primeUserGesture();
    const q = textInput.trim();
    setTextInput('');
    processQuery(q, false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white via-[#FCF8F7] to-[#FAF3F0] rounded-t-[32px] sm:rounded-[36px] shadow-2xl border border-rose-200/80 overflow-hidden flex flex-col h-[94vh] sm:h-[88vh] max-h-[94vh]">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 flex items-center justify-between border-b border-rose-100/70 shrink-0 bg-white/90 backdrop-blur-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <LotusBloomIcon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base sm:text-lg text-warm-textDark truncate">Saheli Voice AI</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold tracking-wide">
                  Two-Way
                </span>
              </div>
              <p className="text-[11px] text-warm-textMuted flex items-center gap-1 truncate">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>ACOG & Monash Clinical Guardrails</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Settings button */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className={`p-2 rounded-xl border transition ${
                showSettingsDrawer ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-warm-cardMuted text-warm-textMuted hover:text-warm-textDark border-warm-border'
              }`}
              title="Voice & Language Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mute button */}
            <button
              onClick={() => {
                if (!isMuted) stopAllAudio();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl border transition ${
                isMuted 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-warm-cardMuted border-warm-border text-warm-textMuted hover:text-warm-textDark'
              }`}
              title={isMuted ? "Unmute spoken replies" : "Mute spoken replies"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-warm-textMuted hover:text-warm-textDark hover:bg-warm-cardMuted transition"
              title="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Selection & Auto-Detection Ribbon */}
        <div className="px-4 py-2 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-rose-900 shrink-0">
            <Globe className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="font-semibold text-[11px]">Speaking:</span>
          </div>

          <select
            value={selectedLang.code}
            onChange={(e) => {
              const found = INDIAN_LANGUAGES.find(l => l.code === e.target.value);
              if (found) {
                setSelectedLang(found);
                setAutoDetectedLangName('');
              }
            }}
            className="text-xs font-bold text-rose-900 bg-white px-2.5 py-1 rounded-xl border border-rose-200 focus:ring-1 focus:ring-rose-400 cursor-pointer shadow-2xs"
          >
            {INDIAN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>

          {autoDetectedLangName && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse shrink-0 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
              Auto: {autoDetectedLangName}
            </span>
          )}
        </div>

        {/* Slide-Down Voice & Speech Settings Drawer */}
        {showSettingsDrawer && (
          <div className="p-4 bg-white border-b border-rose-200 shadow-sm space-y-3 shrink-0 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-warm-border">
              <h4 className="font-bold text-warm-textDark flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-rose-600" />
                Voice Assistant Preferences
              </h4>
              <button 
                type="button" 
                onClick={() => setShowSettingsDrawer(false)}
                className="text-[11px] font-semibold text-rose-600 hover:underline"
              >
                Done
              </button>
            </div>

            {/* Read-Aloud Text Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-warm-textDark block">Read-Aloud Typed Messages</span>
                <span className="text-[11px] text-warm-textMuted">When typing text, also speak the response aloud</span>
              </div>
              <input
                type="checkbox"
                checked={readAloudText}
                onChange={(e) => setReadAloudText(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-400 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-warm-textDark font-medium">Speaking Speed</span>
                <span className="font-mono text-rose-600 font-bold">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Voice Model Selection */}
            {availableVoices.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-warm-textDark block mb-1">Device Voice Accent</label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-warm-border bg-warm-cardMuted text-warm-textDark cursor-pointer"
                >
                  <option value="">Default Recommended Voice</option>
                  {availableVoices
                    .filter(v => v.lang.startsWith(selectedLang.speechTag.slice(0, 2)) || v.lang.includes('IN') || v.lang.startsWith('en'))
                    .map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Permission / Error Notice */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')} className="text-rose-500 hover:text-rose-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Center Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

          {/* Interactive Voice Orb & Live Visualizer */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1">
            <div className="relative flex items-center justify-center">
              
              {/* Outer pulsing rings when active */}
              {state === 'listening' && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-rose-400/25 animate-ping" />
                  <div className="absolute w-44 h-44 rounded-full bg-amber-400/20 animate-pulse" />
                </>
              )}
              {state === 'speaking' && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-pink-500/20 animate-pulse" />
                  <div className="absolute w-44 h-44 rounded-full bg-rose-400/15 animate-ping" />
                </>
              )}
              {state === 'thinking' && (
                <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-rose-400 animate-spin" />
              )}

              {/* Central Voice Orb Button */}
              <button
                type="button"
                onClick={() => {
                  if (state === 'speaking') {
                    handleInterrupt();
                  } else if (state === 'listening') {
                    if (recognitionRef.current) recognitionRef.current.stop();
                  } else {
                    startListening();
                  }
                }}
                className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-glow flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 ${
                  state === 'listening'
                    ? 'bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 scale-105 ring-4 ring-rose-300 text-white'
                    : state === 'speaking'
                    ? 'bg-gradient-to-tr from-pink-600 via-rose-500 to-violet-600 scale-105 text-white'
                    : state === 'thinking'
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 animate-pulse text-white'
                    : 'bg-gradient-to-tr from-rose-500 via-brand-500 to-amber-400 hover:scale-105 text-white'
                }`}
                title={state === 'speaking' ? "Tap to interrupt & ask follow-up" : "Tap to speak to Saheli"}
              >
                {state === 'listening' ? (
                  <>
                    <Mic className="w-8 h-8 animate-bounce" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Listening</span>
                  </>
                ) : state === 'speaking' ? (
                  <>
                    {/* Equalizer frequency dancing bars */}
                    <div className="flex items-end gap-1 h-6 mb-1">
                      <span className="w-1 bg-white rounded-full animate-bounce h-5" />
                      <span className="w-1 bg-white rounded-full animate-bounce h-3 delay-75" />
                      <span className="w-1 bg-white rounded-full animate-bounce h-6 delay-150" />
                      <span className="w-1 bg-white rounded-full animate-bounce h-4 delay-200" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Speaking</span>
                  </>
                ) : state === 'thinking' ? (
                  <>
                    <Sparkles className="w-8 h-8 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Thinking</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Tap to Speak</span>
                  </>
                )}
              </button>
            </div>

            {/* State Caption & Interrupt Button */}
            <div className="mt-3 text-center">
              {state === 'listening' && (
                <p className="text-xs font-bold text-rose-600 animate-pulse">
                  Listening to your voice... Speak naturally in {selectedLang.name}
                </p>
              )}
              {state === 'speaking' && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-pink-700">Saheli is speaking...</span>
                  <button
                    type="button"
                    onClick={handleInterrupt}
                    className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs hover:bg-rose-700 active:scale-95 transition"
                  >
                    Interrupt & Ask
                  </button>
                </div>
              )}
              {state === 'thinking' && (
                <p className="text-xs font-bold text-amber-700 animate-pulse">
                  Consulting evidence-based clinical guidelines...
                </p>
              )}
              {state === 'idle' && (
                <p className="text-xs text-warm-textMuted font-medium">
                  Two-way voice assistant is ready. Speak in Hindi, Punjabi, Hinglish or English.
                </p>
              )}
            </div>

            {/* Spoken audio controls (Replay / Pause / Stop) */}
            {assistantReply && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleReplaySpeech}
                  className="px-3 py-1 rounded-xl bg-white border border-warm-border text-warm-textDark text-[11px] font-bold hover:bg-rose-50 hover:text-rose-600 transition flex items-center gap-1 shadow-2xs"
                  title="Replay spoken response"
                >
                  <RotateCcw className="w-3 h-3" />
                  Replay
                </button>
                {state === 'speaking' && (
                  <button
                    type="button"
                    onClick={handlePauseSpeech}
                    className="px-3 py-1 rounded-xl bg-white border border-warm-border text-warm-textDark text-[11px] font-bold hover:bg-amber-50 hover:text-amber-700 transition flex items-center gap-1 shadow-2xs"
                  >
                    <Pause className="w-3 h-3" />
                    Pause
                  </button>
                )}
                {state === 'paused' && (
                  <button
                    type="button"
                    onClick={handleResumeSpeech}
                    className="px-3 py-1 rounded-xl bg-white border border-warm-border text-warm-textDark text-[11px] font-bold hover:bg-emerald-50 hover:text-emerald-700 transition flex items-center gap-1 shadow-2xs"
                  >
                    <Play className="w-3 h-3" />
                    Resume
                  </button>
                )}
                {(state === 'speaking' || state === 'paused') && (
                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="px-3 py-1 rounded-xl bg-white border border-warm-border text-warm-textDark text-[11px] font-bold hover:bg-rose-50 hover:text-rose-600 transition flex items-center gap-1 shadow-2xs"
                  >
                    <Square className="w-3 h-3" />
                    Stop
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Transcript / Live User Speech Bubble */}
          {transcript && (
            <div className="p-3 rounded-2xl bg-rose-50/90 border border-rose-200 shadow-2xs animate-fade-in">
              <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider block mb-0.5">
                Recognized Speech:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-warm-textDark">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Recent Synchronized Messages List */}
          <div className="space-y-3">
            {messages.slice(-6).map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                      <LotusBloomIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-tr-none'
                        : 'bg-white border border-rose-100 text-warm-textDark rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${isUser ? 'text-rose-100' : 'text-rose-600'}`}>
                        {isUser ? 'You' : `Saheli (${msg.languageCode.toUpperCase()})`}
                      </span>
                      <span className={`text-[9px] ${isUser ? 'text-rose-200' : 'text-warm-textMuted'}`}>
                        {msg.mode === 'voice' ? '🎙️ Voice' : '⌨️ Text'}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{msg.content}</p>
                    
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-rose-100/60 text-[10px] text-warm-textMuted">
                        <span>Sources: {msg.sources.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-warm-textMuted block mb-2">
              Suggested topics in {selectedLang.name}:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {currentQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => processQuery(q, false)}
                  className="p-2 sm:p-2.5 rounded-xl bg-white border border-warm-border hover:border-rose-300 hover:bg-rose-50/50 text-left text-xs font-semibold text-warm-textDark transition flex items-center justify-between shadow-2xs group"
                >
                  <span className="truncate pr-2">{q}</span>
                  <Send className="w-3 h-3 text-rose-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Hybrid Text Chat & Microphone Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-rose-100/80 shrink-0">
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
            
            {/* Quick Mic input toggle */}
            <button
              type="button"
              onClick={startListening}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition shadow-2xs active:scale-95 ${
                state === 'listening'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
              }`}
              title="Speak with Saheli"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Text Input field */}
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Ask in ${selectedLang.name} or type here...`}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-warm-cardMuted/70 border border-warm-border text-xs sm:text-sm text-warm-textDark placeholder:text-warm-textMuted focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!textInput.trim() || state === 'thinking'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-2xs transition active:scale-95"
              title="Send text message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-warm-textMuted">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-rose-500" />
              Multilingual Voice & Text Companion
            </span>
            <span>
              {readAloudText ? '🔊 Read-aloud ON' : '💬 Text-only replies for typing'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
