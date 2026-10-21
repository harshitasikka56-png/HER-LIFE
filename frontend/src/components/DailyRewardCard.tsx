import React, { useState } from 'react';
import { Sparkles, Heart, Award, Smile, CheckCircle, RefreshCw, Feather } from 'lucide-react';
import { Language } from '../services/i18n';

interface DailyRewardCardProps {
  userName: string;
  language: Language;
  sleepHours: number;
  hydrationGlasses: number;
  stressLevel: number;
}

export const DailyRewardCard: React.FC<DailyRewardCardProps> = ({
  userName,
  language,
  sleepHours,
  hydrationGlasses,
  stressLevel
}) => {
  const isHinglish = language === 'hinglish';
  const firstName = userName.split(' ')[0];

  // Self-care checklist state
  const [completedHabits, setCompletedHabits] = useState<{ [key: string]: boolean }>({
    water: hydrationGlasses >= 6,
    rest: sleepHours >= 7,
    kindness: true,
    movement: false
  });

  const habitsList = [
    { id: 'water', label: isHinglish ? 'Paani peena (6+ glasses)' : 'Hydrated well (6+ glasses)' },
    { id: 'rest', label: isHinglish ? 'Neend ya aaram ka waqt' : 'Adequate sleep or rest' },
    { id: 'kindness', label: isHinglish ? 'Khud par narmi aur self-care' : 'Gentle self-compassion' },
    { id: 'movement', label: isHinglish ? 'Halka stretch / study break' : 'Gentle movement or break' }
  ];

  const fulfilledCount = Object.values(completedHabits).filter(Boolean).length;
  const isFulfilled = fulfilledCount >= 3;

  function toggleHabit(id: string) {
    setCompletedHabits(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-warm-border shadow-soft relative overflow-hidden transition-all duration-300">
      {/* Background ambient gradient */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${
        isFulfilled ? 'bg-rose-200/40' : 'bg-lavender-200/40'
      }`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-soft ${
            isFulfilled ? 'bg-gradient-to-tr from-brand-500 to-rose-400' : 'bg-gradient-to-tr from-plum-600 to-lavender-500'
          }`}>
            {isFulfilled ? <Heart className="w-5 h-5 fill-white" /> : <Feather className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-warm-textMuted">
              {isHinglish ? 'Din Ke Aakhri Pal (Daily Reflection)' : 'End-of-Day Word Gesture & Reward'}
            </span>
            <h3 className="text-lg font-bold font-serif text-warm-textDark">
              {isFulfilled 
                ? (isHinglish ? `Aapke Liye Pyaar Bhara Reward, ${firstName} ✨` : `A Heartfelt Reward for You, ${firstName} ✨`)
                : (isHinglish ? `Aapke Liye Dulaar Aur Himmat, ${firstName} 🤍` : `Gentle Comfort & Motivation, ${firstName} 🤍`)}
            </h3>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isFulfilled 
            ? 'bg-rose-50 text-rose-700 border-rose-200' 
            : 'bg-lavender-50 text-plum-700 border-lavender-200'
        }`}>
          {isFulfilled 
            ? (isHinglish ? 'Routine Poori Huyi 🌸' : 'Routine Completed 🌸')
            : (isHinglish ? 'Halka Din • Rest Zaroori Hai 🌿' : 'Tough Day • Rest Needed 🌿')}
        </span>
      </div>

      {/* Daily Checklist Pills */}
      <div className="mb-5 relative z-10">
        <span className="text-xs font-semibold text-warm-textDark mb-2 block">
          {isHinglish ? 'Aaj aapne kya-kya fulfill kiya:' : 'Check what you managed to do today:'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {habitsList.map((h) => {
            const active = completedHabits[h.id];
            return (
              <button
                type="button"
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className={`p-2.5 rounded-2xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                    : 'bg-warm-cardMuted/70 text-warm-textMuted border-warm-border hover:bg-warm-border'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                  active ? 'bg-emerald-500 text-white border-emerald-500' : 'border-warm-border bg-white'
                }`}>
                  {active ? '✓' : ''}
                </span>
                <span className="truncate">{h.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reward in Words OR Consoling Motivation (3-4 lines) */}
      <div className={`p-4 sm:p-5 rounded-2xl border relative z-10 ${
        isFulfilled 
          ? 'bg-gradient-to-r from-rose-50/80 via-brand-50/60 to-rose-50/80 border-rose-200/80' 
          : 'bg-gradient-to-r from-lavender-50/90 via-plum-50/60 to-lavender-50/90 border-lavender-200/80'
      }`}>
        {isFulfilled ? (
          /* REWARD IN WORDS: When Routine Guidelines Are Fulfilled */
          <div className="space-y-1.5 text-xs text-warm-textDark leading-relaxed">
            <div className="flex items-center gap-1.5 text-brand-700 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{isHinglish ? 'Aapka Dil Se Sammaan (Word Reward):' : 'Your Word Reward:'}</span>
            </div>
            <p className="italic font-serif text-sm text-brand-900 leading-normal">
              {isHinglish ? (
                <>
                  "Aapne aaj apne sharir aur sehat ka sachche dil se dhyan rakha, {firstName}!<br />
                  Paani peena, aaram lena aur apne routine ka khayal rakhna aapki sabse khoobsurat taakat hai.<br />
                  Aaj raat bina kisi chinta ke sukoon se soyein — aapne apna sabse behtar diya hai. So proud of you! 💖🌸"
                </>
              ) : (
                <>
                  "You showed up for yourself with patience and grace today, {firstName}!<br />
                  Taking care of your body through water, rest, and conscious self-care is a quiet superpower.<br />
                  Rest deeply tonight knowing you gave your body the love and patience it truly deserved. So proud of you! 💖🌸"
                </>
              )}
            </p>
          </div>
        ) : (
          /* CONSOLING & MOTIVATION: When She Couldn't Fulfill The Routine */
          <div className="space-y-1.5 text-xs text-warm-textDark leading-relaxed">
            <div className="flex items-center gap-1.5 text-plum-700 font-bold mb-1">
              <Feather className="w-4 h-4" />
              <span>{isHinglish ? 'Hausla Aur Dulaar (Console & Motivation):' : 'Comfort & Motivation:'}</span>
            </div>
            <p className="italic font-serif text-sm text-plum-900 leading-normal">
              {isHinglish ? (
                <>
                  "Kabhi-kabhi kuch din sirf saans lene aur aaram karne ke liye hote hain, aur woh bilkul theek hai, {firstName}.<br />
                  Aapka sharir har pal aapke liye mehnat kar raha hai, isliye agar aaj routine poori nahi hui toh udaas mat hona.<br />
                  Aane wala kal ek nayi shuruaat lekar aayega — aaj raat khud par narmi baratna aur bina guilty huye aaram karna. ✨🌿"
                </>
              ) : (
                <>
                  "Some days are just about breathing and getting through, and that is more than enough, {firstName}.<br />
                  Your body is working tirelessly for you every single second—never judge yourself for what had to wait today.<br />
                  Tomorrow brings a brand new sunrise with zero mistakes in it. Sleep gently and be deeply kind to yourself tonight. ✨🌿"
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
