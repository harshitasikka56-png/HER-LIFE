import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Droplets, 
  Smile, 
  ThumbsUp, 
  Info,
  Clock,
  Sparkle,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Language } from '../services/i18n';

interface FirstPeriodEducationSlideProps {
  language: Language;
  onClose?: () => void;
  defaultExpanded?: boolean;
}

interface SlideData {
  id: number;
  badgeEn: string;
  badgeHi: string;
  titleEn: string;
  titleHi: string;
  taglineEn: string;
  taglineHi: string;
  colorScheme: {
    bgGrad: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  content: {
    en: {
      headline: string;
      body: string[];
      keyTakeaways: { label: string; desc: string }[];
      proTip: string;
    };
    hinglish: {
      headline: string;
      body: string[];
      keyTakeaways: { label: string; desc: string }[];
      proTip: string;
    };
  };
}

export const FirstPeriodEducationSlide: React.FC<FirstPeriodEducationSlideProps> = ({
  language,
  onClose,
  defaultExpanded = true
}) => {
  const isHinglish = language === 'hinglish';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Quiz state for interactive slide
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number | null }>({
    1: null,
    2: null,
    3: null
  });

  const SLIDES: SlideData[] = [
    {
      id: 1,
      badgeEn: "Slide 1 of 8 • The Basics",
      badgeHi: "Slide 1 of 8 • Basic Jankari",
      titleEn: "What is a Period? (Demystifying Your Body)",
      titleHi: "Period Kya Hota Hai? (Sharir Ka Normal Badlaav)",
      taglineEn: "Zero fear, zero shame — pure science and natural biology explained simply.",
      taglineHi: "Bina kisi dar ya sharam ke — saral shabdon mein sharir ka sach.",
      colorScheme: {
        bgGrad: "from-rose-500/10 via-brand-500/5 to-rose-400/10",
        badgeBg: "bg-rose-100",
        badgeText: "text-rose-700",
        accent: "text-brand-700"
      },
      content: {
        en: {
          headline: "Your body is building a cozy blanket every month",
          body: [
            "Inside your lower belly is a small, pear-shaped muscular organ called the uterus (or womb). Each month, natural chemical messengers called hormones (estrogen and progesterone) tell the uterus to build a soft, plush cushion of blood vessels and nutrients.",
            "This soft lining is prepared just in case a baby grows there one day. If there is no baby, your body realizes it doesn't need this velvet cushion right now. So it gently lets the lining slip away.",
            "This gentle release of the cushion is what we call a period (menstruation). It flows out gently through a small opening called the vagina."
          ],
          keyTakeaways: [
            { label: "Not an Injury", desc: "You are NOT hurt or wounded. There are no cuts inside you." },
            { label: "Not Dirty Waste", desc: "Period blood is completely clean blood and tissue, not toxic dirt." },
            { label: "Tiny Volume", desc: "It looks like a lot, but is actually only 2 to 3 tablespoons (30-50 ml) total across all days!" }
          ],
          proTip: "A period is proof that your body is blossoming into a healthy, strong, and capable adult!"
        },
        hinglish: {
          headline: "Aapka sharir har mahine ek naram bistar (cushion) banata hai",
          body: [
            "Aapke pet ke nichle hisse mein ek angoor ya naashpati jaisa organ hota hai jise uterus (bachedani) kehte hain. Har mahine hamare hormones uterus ko ek naram, khoon aur poshak tatvon se bhara cushion taiyar karne ko kehte hain.",
            "Yeh cushion isliye banta hai taaki bhavishya mein bacha aaram se reh sake. Jab pregnancy nahi hoti, toh sharir is cushion ko aahista se saaf karta hai.",
            "Isi naram cushion ke nikalne ko 'Period' ya 'Mahavari' kehte hain. Yeh bilkul natural aur healthy prakriya hai."
          ],
          keyTakeaways: [
            { label: "Koi Chot Nahi", desc: "Aapko koi chot ya zakhm nahi laga hai. Sharir andar se bilkul theek hai." },
            { label: "Khoon Ganda Nahi Hai", desc: "Yeh koi ganda ya zehreela khoon nahi hai, balki nayi life banane wala saaf tissue hai." },
            { label: "Bahut Kam Maatra", desc: "Pore period mein sirf 2-3 chamach (table spoons) jitna hi khoon nikalta hai." }
          ],
          proTip: "Period aana is baat ka saboot hai ki aapka sharir swasth aur shaktishaali ban raha hai!"
        }
      }
    },
    {
      id: 2,
      badgeEn: "Slide 2 of 8 • First Signs",
      badgeHi: "Slide 2 of 8 • Pehle Sanket",
      titleEn: "When Does It Start & What Does It Look Like?",
      titleHi: "Pehla Period Kab Aata Hai Aur Kaisa Dikhta Hai?",
      taglineEn: "Every girl has her own unique biological clock.",
      taglineHi: "Har ladki ke sharir ka apna anokha natural clock hota hai.",
      colorScheme: {
        bgGrad: "from-lavender-500/10 via-purple-500/5 to-lavender-400/10",
        badgeBg: "bg-lavender-100",
        badgeText: "text-lavender-700",
        accent: "text-purple-700"
      },
      content: {
        en: {
          headline: "Age, colors, and subtle clues your body gives beforehand",
          body: [
            "Most girls get their first period (called 'menarche') between ages 9 and 15, with the average age being around 12 to 13. Neither starting at 10 nor at 14 means anything is wrong.",
            "Months before it arrives, you will likely notice a thin, clear or milky white discharge in your underwear. This is nature's self-cleaning lotion and a normal sign your body is maturing.",
            "The very first period is often very light—just a few reddish or brownish spots on your underwear. The color can range from bright cherry red to rust-brown, and both are 100% normal!"
          ],
          keyTakeaways: [
            { label: "Brown Spots?", desc: "Brown blood is just blood that moved slowly and met air. Totally safe!" },
            { label: "Irregular at First", desc: "During the first 1-2 years, periods can skip a month or come early while hormones balance." },
            { label: "Duration", desc: "A typical period lasts anywhere between 3 to 7 days." }
          ],
          proTip: "If you notice white discharge in your underwear, it means your period might arrive in the next 6 to 12 months!"
        },
        hinglish: {
          headline: "Umar, rang, aur sharir ke pehle sanket",
          body: [
            "Zyadatar ladkiyon ka pehla period 9 se 15 saal ki umar ke beech aata hai (average 12-13 saal). Jaldi ya thoda late aane mein koi burai nahi hoti.",
            "Period aane se kuch mahine pehle panty par safed ya halka paani jaisa discharge dikhta hai. Yeh vagina ka natural cleansing system hai aur normal sign hai.",
            "Pehli baar mein shayad sirf 2-3 halki brown ya laal boondein hi dikhein. Brown rang ka matlab sirf yeh hai ki khoon thoda aahista bahar aaya hai."
          ],
          keyTakeaways: [
            { label: "Brown Rang?", desc: "Brown blood purana khoon hota hai jo hawa se milne par gehra ho jata hai. Bilkul normal!" },
            { label: "Shuru Mein Irregular", desc: "Pehle 1-2 saal hormones balance hone mein waqt lete hain, isliye cycle aage-peeche ho sakti hai." },
            { label: "Kitne Din?", desc: "Aam taur par period 3 se 7 din tak chalta hai." }
          ],
          proTip: "Agar panty mein safed discharge dikhne lage, toh samajh lijiye agle 6 se 12 mahino mein period aa sakta hai!"
        }
      }
    },
    {
      id: 3,
      badgeEn: "Slide 3 of 8 • Practical Step-by-Step",
      badgeHi: "Slide 3 of 8 • Step-by-Step Guide",
      titleEn: "How to Use a Sanitary Pad (Zero Guesswork)",
      titleHi: "Sanitary Pad Kaise Use Karein (Aasan Tareeka)",
      taglineEn: "Simple, step-by-step instructions so you feel confident anytime, anywhere.",
      taglineHi: "Kadam-dar-kadam tarika taaki aap bina hichkichaye pad use kar sakein.",
      colorScheme: {
        bgGrad: "from-cyan-500/10 via-teal-500/5 to-cyan-400/10",
        badgeBg: "bg-cyan-100",
        badgeText: "text-cyan-800",
        accent: "text-teal-700"
      },
      content: {
        en: {
          headline: "Applying, changing, and disposing of pads with zero stress",
          body: [
            "1. Wash hands with soap and water.",
            "2. Unwrap the pad from its plastic wrapper. (Keep the wrapper handy to wrap the used one later!)",
            "3. Peel off the long backing paper strip to expose the sticky surface.",
            "4. Stick the adhesive side firmly into the center of your underwear gusset.",
            "5. Peel the paper from the wings (the side flaps) and fold them underneath both edges of the panty.",
            "6. Pull your underwear up and adjust so the pad sits flat against your skin."
          ],
          keyTakeaways: [
            { label: "Change Timing", desc: "Change your pad every 4 to 6 hours, even on light flow days, for hygiene." },
            { label: "Disposal Rule", desc: "Roll up the used pad, wrap in paper or wrapper, and put in the dustbin." },
            { label: "NEVER Flush", desc: "Never flush a pad down the toilet—it will clog the plumbing." }
          ],
          proTip: "Always wear snug cotton underwear during your period—it holds the pad securely and prevents shifting!"
        },
        hinglish: {
          headline: "Pad lagane, badalne, aur phenkne ka sahi dhang",
          body: [
            "1. Sabse pehle sabun aur paani se haath dho lein.",
            "2. Pad ke plastic wrapper ko kholein. (Wrapper ko phenkein mat, baad mein purana pad lapetne ke kaam aayega!)",
            "3. Pad ke peeche ki lambi patti (paper) ko hatayein jisse chipkane wala hissa dikhe.",
            "4. Pad ko apni panty ke beech wale hisse par achhi tarah chipka dein.",
            "5. Wings (side ke pankh) ka paper hatakar unhe panty ke dono kinaron ke neeche modkar chipka dein.",
            "6. Panty pehan lein aur check karein ki pad theek se laga hai."
          ],
          keyTakeaways: [
            { label: "Kab Badlein?", desc: "Har 4 se 6 ghante mein pad badal lein, chahe flow halka hi kyun na ho." },
            { label: "Phenkne Ka Niyam", desc: "Purane pad ko roll karke akhbaar ya wrapper mein lapetein aur dustbin mein daalein." },
            { label: "Flush Kabhi Na Karein", desc: "Pad ko toilet mein flush mat karein, pipe jaam ho jayegi." }
          ],
          proTip: "Period ke dino mein hamesha aaramdayak cotton panty pehnein, isse pad apni jagah tika rehta hai!"
        }
      }
    },
    {
      id: 4,
      badgeEn: "Slide 4 of 8 • School Survival",
      badgeHi: "Slide 4 of 8 • School & Travel Kit",
      titleEn: "What If It Starts at School? (Zero Panic Plan)",
      titleHi: "Agar School Mein Period Shuru Ho Jaye Toh? (Zero Panic)",
      taglineEn: "Every woman has faced this—here is your secret emergency toolkit.",
      taglineHi: "Har ladki ke saath yeh hua hai—yeh hai aapka aasan emergency plan.",
      colorScheme: {
        bgGrad: "from-amber-500/10 via-orange-500/5 to-amber-400/10",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-800",
        accent: "text-amber-700"
      },
      content: {
        en: {
          headline: "Pack your mini pouch and know what to do if you leak",
          body: [
            "Pack a small zippered pouch in your school bag with: 2 sanitary pads, 1 spare clean panty, and a small pack of pocket tissues.",
            "What if you feel wetness during class? Quietly ask the teacher to go to the washroom. Check your underwear gently. If it's your period, place your pad on your panty.",
            "What if blood leaked onto your skirt or pants? DON'T PANIC! Tie your cardigan, school sweater, or jacket around your waist. This covers the back completely. Then head to the school medical room or nurse's office."
          ],
          keyTakeaways: [
            { label: "Ask for Help", desc: "School nurses, female teachers, and friends always have spare pads. Never hesitate to whisper and ask!" },
            { label: "Not Embarrassing", desc: "Leaking is not a failure. It happens to literally every menstruating woman on Earth." },
            { label: "Cold Water Wash", desc: "If you get a stain on clothes, rinse with cold water immediately—cold water lifts blood out easily." }
          ],
          proTip: "Keep a sweater or hoodie in your school locker or bag. It's the ultimate fashionable emergency shield!"
        },
        hinglish: {
          headline: "School bag mein emergency pouch rakhein aur bina darein handle karein",
          body: [
            "Apne school bag mein ek chhota pouch rakhein jismein: 2 pads, 1 extra panty, aur pocket tissue paper ho.",
            "Agar class ke dauran geelepan ka ehsaas ho, toh bina sharmaye teacher se washroom jaane ki permission maangein.",
            "Agar skirt ya pant par daag lag jaye toh ghabrayein bilkul nahi! Apni sweater ya jacket ko kamar ke chaaron taraf baandh lein. Isse daag chhip jata hai. Fir school nurse ya female teacher ke paas jayein."
          ],
          keyTakeaways: [
            { label: "Madad Maangein", desc: "School nurse, female teacher ya kisi saheli se bina jhijhak pad maang sakti hain." },
            { label: "Sharam Ki Baat Nahi", desc: "Daag lagna koi galati nahi hai. Duniya ki har aurat ke saath aisa ho chuka hai." },
            { label: "Thande Paani Se Dhoyein", desc: "Agar kapde par daag lage, toh turant thande paani se dhone par daag nikal jata hai." }
          ],
          proTip: "School bag mein hamesha ek cardigan ya jacket rakhein, yeh zaroorat padne par sabse aasan cover-up hai!"
        }
      }
    },
    {
      id: 5,
      badgeEn: "Slide 5 of 8 • Cramps & Relief",
      badgeHi: "Slide 5 of 8 • Dard Aur Aaram",
      titleEn: "Cramps, Moods & Simple Home Comforts",
      titleHi: "Pet Dard (Cramps) Aur Mood Ke Gharelu Upay",
      taglineEn: "Why your tummy hurts and natural ways to soothe your body gently.",
      taglineHi: "Dard kyun hota hai aur bina tension ke sharir ko kaise aaram dein.",
      colorScheme: {
        bgGrad: "from-emerald-500/10 via-teal-500/5 to-emerald-400/10",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-800",
        accent: "text-emerald-700"
      },
      content: {
        en: {
          headline: "Why cramps happen and 4 easy tricks to feel better fast",
          body: [
            "Why do cramps happen? To help that velvet cushion slip out, your uterus gently squeezes and relaxes (like a tiny muscle hug). A natural chemical called prostaglandin causes this squeezing.",
            "Cramps usually feel like an ache in your lower belly, back, or upper thighs. They are strongest on days 1 and 2, then fade away.",
            "Your hormones also change rapidly, which can make you feel emotional, sleepy, or wanting a warm hug. Your feelings are 100% normal and valid."
          ],
          keyTakeaways: [
            { label: "Warm Water Bottle", desc: "Placing a heating pad or warm water bag on your lower tummy melts muscle tension." },
            { label: "Warm Sips", desc: "Sip warm water, ginger tea, or chamomile tea. Avoid icy-cold sodas." },
            { label: "Curled Sleeping", desc: "Sleep on your side with knees tucked and a pillow between your legs (fetal pose)." }
          ],
          proTip: "Gentle walking or slow cat-cow stretching actually pumps blood and reduces cramps faster than staying completely still!"
        },
        hinglish: {
          headline: "Pet mein dard kyun hota hai aur aaram paane ke 4 aasan tareeqe",
          body: [
            "Pet dard kyun hota hai? Uterus us naram cushion ko nikalne ke liye halka-halka contract (sikudta) hota hai. Is contract karne se pet ya kamar mein halka dard hota hai.",
            "Dard aam taur par pehle aur doosre din zyada hota hai, fir kam hone lagta hai.",
            "Hormone ke utar-chadaav ki wajah se mood thoda chidchida ya rona aa sakta hai. Yeh bilkul normal hai, khud par narmi bartein."
          ],
          keyTakeaways: [
            { label: "Garam Paani Ki Bottle", desc: "Pet ke nichle hisse par garam paani ki thailee (hot water bag) rakhne se turant aaram milta hai." },
            { label: "Garam Cheezein Piyein", desc: "Gunguna paani, adrak wali chai ya sup piyein. Bahut thande drinks se bachein." },
            { label: "Karwat Lekar Soyein", desc: "Side mein ghutne modkar soyein aur do taango ke beech takiya rakhein." }
          ],
          proTip: "Halka-phulka chalna ya stretch karna khoon ka daura theek karta hai aur dard ko kam karta hai!"
        }
      }
    },
    {
      id: 6,
      badgeEn: "Slide 6 of 8 • Pure Truth vs Myths",
      badgeHi: "Slide 6 of 8 • Sach Aur Afwahein",
      titleEn: "Myth Busting: What is True vs. Superstition?",
      titleHi: "Afwahon Ka Sach: Kya Sahi Hai Aur Kya Galat?",
      taglineEn: "Debunking old myths so you can live freely and proudly.",
      taglineHi: "Purani galatfehmiyon ko dur karke aazaadi se jiyein.",
      colorScheme: {
        bgGrad: "from-blue-500/10 via-indigo-500/5 to-blue-400/10",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-800",
        accent: "text-blue-700"
      },
      content: {
        en: {
          headline: "Throw away the old taboos—science says you are completely clean",
          body: [
            "MYTH: 'You shouldn't take a bath or wash your hair during your period.' -> FACT: Warm baths and showers are wonderful! They relax cramping muscles and keep you feeling fresh and energized.",
            "MYTH: 'You cannot play sports, run, or swim.' -> FACT: You can dance, run, play badminton, and do everything you love. Exercise releases endorphins (happy hormones) that fight pain!",
            "MYTH: 'Touching food or pickles will spoil them.' -> FACT: 100% false superstition. Menstruation is an internal biological process; your hands and skin are pure and clean."
          ],
          keyTakeaways: [
            { label: "No Rest Limits", desc: "You do NOT have to stay locked in a room. You can go everywhere and study normally." },
            { label: "Hygiene is Key", desc: "Wash your genital area with plain warm water from front to back. Avoid harsh scented soaps." },
            { label: "Proud Milestone", desc: "A period is not a curse or weakness; it is the power of your feminine body." }
          ],
          proTip: "Never let anyone make you feel dirty or isolated. You are vibrant, clean, and strong!"
        },
        hinglish: {
          headline: "Purane vishwas chhodkar science aur medical sach ko jaanein",
          body: [
            "MYTH: 'Period mein sar nahi dhona chahiye ya nahana nahi chahiye.' -> SACH: Gungune paani se nahana cramps ke liye behad faydemand hai aur aapko fresh rakhta hai.",
            "MYTH: 'Khel-kood ya daudna nahi chahiye.' -> SACH: Aap daud sakti hain, badminton khel sakti hain aur dance kar sakti hain. Exercise se natural painkillers release hote hain!",
            "MYTH: 'Achaar chhoone se kharab ho jata hai.' -> SACH: Bilkul galat afwah hai. Period blood shareer ke andar se aata hai, aapke haath bilkul saaf hain."
          ],
          keyTakeaways: [
            { label: "Koi Bandish Nahi", desc: "Aapko alag baithne ya kamre mein band rehne ki koi zaroorat nahi hai. Sab kuch normal hai." },
            { label: "Safai Ka Tareeqa", desc: "Aage se peeche ki taraf saaf paani se wash karein. Tez khushbu wale sabun se bachein." },
            { label: "Garv Ka Lamha", desc: "Period koi sharam ya bimari nahi hai, yeh ek swasth ladki ki khoobsurat pehchan hai." }
          ],
          proTip: "Kisi ke kehne par khud ko ashuddh ya kamzor na samjhein. Aap bilkul saaf aur strong hain!"
        }
      }
    },
    {
      id: 7,
      badgeEn: "Slide 7 of 8 • Safety & Red Flags",
      badgeHi: "Slide 7 of 8 • Doctor Se Kab Milein",
      titleEn: "When to Ask for Help & How to Talk to Mom / Doctor",
      titleHi: "Doctor Ya Mummy Se Madad Kab Aur Kaise Maangein?",
      taglineEn: "Knowing the boundary between normal period discomfort and when to get care.",
      taglineHi: "Samjhein ki normal dard kya hai aur kab doctor se salah leni chahiye.",
      colorScheme: {
        bgGrad: "from-rose-500/10 via-pink-500/5 to-rose-400/10",
        badgeBg: "bg-rose-100",
        badgeText: "text-rose-800",
        accent: "text-rose-700"
      },
      content: {
        en: {
          headline: "Red flags to watch out for and a simple script you can say",
          body: [
            "Most periods are mild and manageable. However, you should never have to suffer in unbearable agony in silence.",
            "When to see a doctor or tell an adult immediately:",
            "• If you soak through an entire pad in 1 hour for more than 2 consecutive hours.",
            "• If period pain is so severe that you vomit, faint, or cannot stand even after resting.",
            "• If your period lasts longer than 8 continuous days.",
            "• If you pass blood clots larger than a large coin (golf ball size)."
          ],
          keyTakeaways: [
            { label: "Simple Script", desc: "'Mom / Didi, my tummy pain is very intense today and my pad is filling up very fast. Can we please see a doctor?'" },
            { label: "No Shame in Clinics", desc: "Gynecologists and pediatricians answer these questions every day. They are there to help!" },
            { label: "Pain Relief", desc: "Always consult a doctor before taking strong painkillers like mefenamic acid or ibuprofen." }
          ],
          proTip: "Never suffer through severe pain thinking it's 'just a woman's duty.' Severe pain is a medical cue to check in with a doctor!"
        },
        hinglish: {
          headline: "Khatre ke nishaan aur mummy ya doctor se baat karne ka asaan tareeqa",
          body: [
            "Zyadatar period aam dard ke saath nikal jaate hain. Lekin kisi bhi ladki ko asahniya dard chupchap jhelne ki zaroorat nahi hai.",
            "Doctor se kab salah lein:",
            "• Agar har 1 ghante mein poora pad geela ho raha ho aur aisa 2 ghante se zyada chale.",
            "• Agar pet dard itna tez ho ki ulti aa jaye, chakkar aaye ya bister se utha na jaye.",
            "• Agar bleeding lagatar 8 din se zyada chale.",
            "• Agar coin ya golf ball jitne bade thakke (clots) niklein."
          ],
          keyTakeaways: [
            { label: "Mummy Se Kya Bolein?", desc: "'Mummy, aaj pet mein dard bahut tez hai aur flow bohot heavy hai. Kya hum doctor ke paas jaakar check karva sakte hain?'" },
            { label: "Doctor Se Baat", desc: "Lady doctors (gynecologists) rozana aisi samasyaon ka ilaaj karti hain, ismein koi sharam nahi." },
            { label: "Dawa Lene Se Pehle", desc: "Bina doctor ki salah ke koi bhi tez painkiller na lein." }
          ],
          proTip: "Dard ko chupchap bardasht karna koi bahaduri nahi hai. Doctor se milna aapka adhikaar hai!"
        }
      }
    },
    {
      id: 8,
      badgeEn: "Slide 8 of 8 • Interactive Zero-Fear Quiz",
      badgeHi: "Slide 8 of 8 • Zero-Fear Quiz",
      titleEn: "Zero-Fear Confidence Check (Test What You Learned!)",
      titleHi: "Zero-Fear Quiz: Dekhein Aapne Kitna Jaana! 🌸",
      taglineEn: "Fun, quick interactive check to make you feel 100% prepared and fearless.",
      taglineHi: "Mazedaar quiz jo aapke andar ka darr hamesha ke liye mita dega.",
      colorScheme: {
        bgGrad: "from-brand-500/10 via-rose-500/5 to-brand-400/10",
        badgeBg: "bg-brand-100",
        badgeText: "text-brand-800",
        accent: "text-brand-700"
      },
      content: {
        en: {
          headline: "Tap an answer below to test your knowledge",
          body: [
            "You are now fully equipped with true knowledge! Take these 3 quick checks to lock in your confidence."
          ],
          keyTakeaways: [],
          proTip: "Share this knowledge with your friends and sisters so no young girl has to feel afraid!"
        },
        hinglish: {
          headline: "Neeche diye sawalon par tap karke apna confidence check karein",
          body: [
            "Ab aapke paas sahi aur puri jankari hai! In 3 chote sawalon ka jawab dekar apna darr hamesha ke liye bhaga dein."
          ],
          keyTakeaways: [],
          proTip: "Yeh jankari apni saheliyon aur behno ke saath bhi share karein taaki kisi ko dar na lage!"
        }
      }
    }
  ];

  const current = SLIDES[currentSlide];
  const activeContent = isHinglish ? current.content.hinglish : current.content.en;

  function nextSlide() {
    setCurrentSlide(prev => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  }

  function prevSlide() {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  }

  return (
    <div className="bg-white rounded-3xl border border-rose-200/80 shadow-soft overflow-hidden transition-all duration-300">
      {/* Top Header & Expand / Collapse bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 via-brand-50/50 to-rose-50 border-b border-rose-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-rose-400 flex items-center justify-center text-white shadow-soft shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-700 bg-brand-100/80 px-2 py-0.5 rounded-full">
                {isHinglish ? 'Nayi Shuruaat • Zero Knowledge Guide' : 'Beginner Friendly • Zero Knowledge Hub'}
              </span>
              <span className="text-xs text-rose-600 font-bold hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isHinglish ? 'Pehla Period Guide' : 'First Period Master Guide'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-warm-textDark mt-0.5">
              {isHinglish ? 'New to Periods? Aasan Bhasha Mein Poori Jankari 🌸' : 'New to Cycles? Complete Beginner Guide (No Prior Knowledge Needed) 🌸'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-brand-700 transition"
          >
            {isExpanded 
              ? (isHinglish ? 'Hide Slides ▲' : 'Collapse Guide ▲')
              : (isHinglish ? 'Open Full Slides (8 Slides) ▼' : 'Open Full Slides (8 Slides) ▼')}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-7 relative">
          {/* Slide Indicator Bar & Navigation Chips */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-warm-border/60 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition whitespace-nowrap flex items-center gap-1 ${
                    currentSlide === idx
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-warm-cardMuted text-warm-textMuted hover:bg-warm-border'
                  }`}
                >
                  <span>{s.id}.</span>
                  <span className="hidden md:inline">{isHinglish ? s.badgeHi.split('•')[1] : s.badgeEn.split('•')[1]}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={prevSlide}
                className="w-8 h-8 rounded-xl bg-warm-cardMuted hover:bg-warm-border flex items-center justify-center text-warm-textDark transition"
                title="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-warm-textMuted px-1">
                {currentSlide + 1} / {SLIDES.length}
              </span>
              <button
                type="button"
                onClick={nextSlide}
                className="w-8 h-8 rounded-xl bg-warm-cardMuted hover:bg-warm-border flex items-center justify-center text-warm-textDark transition"
                title="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Slide Body Container */}
          <div className={`rounded-2xl p-6 sm:p-7 border border-rose-100 bg-gradient-to-br ${current.colorScheme.bgGrad} relative transition-all duration-300`}>
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${current.colorScheme.badgeBg} ${current.colorScheme.badgeText}`}>
                {isHinglish ? current.badgeHi : current.badgeEn}
              </span>
              <span className="text-xs text-warm-textMuted font-medium italic">
                {isHinglish ? 'Har ladki ke liye aasan aur surakshit' : 'Gentle education for first-timers'}
              </span>
            </div>

            {/* Slide Title */}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-warm-textDark">
              {isHinglish ? current.titleHi : current.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-warm-textMuted mt-1 mb-5">
              {isHinglish ? current.taglineHi : current.taglineEn}
            </p>

            {/* Slide Content: Check if Quiz or Standard slide */}
            {current.id === 8 ? (
              /* SLIDE 8: INTERACTIVE QUIZ */
              <div className="space-y-4">
                {/* Question 1 */}
                <div className="bg-white/90 p-4 rounded-2xl border border-warm-border shadow-xs">
                  <span className="text-xs font-bold text-brand-800 block mb-1">
                    {isHinglish ? 'Sawaal 1: Kya period khoon ganda ya zehreela hota hai?' : 'Question 1: Is period blood dirty, toxic waste or an injury?'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setQuizAnswers(prev => ({ ...prev, 1: 1 }))}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                        quizAnswers[1] === 1 
                          ? 'bg-rose-50 border-rose-300 text-rose-800' 
                          : 'bg-warm-cardMuted/50 border-warm-border hover:bg-white'
                      }`}
                    >
                      <span>❌ {isHinglish ? 'Haan, yeh sharir ka ganda khoon hai' : 'Yes, it is waste and dirty'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizAnswers(prev => ({ ...prev, 1: 2 }))}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                        quizAnswers[1] === 2 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' 
                          : 'bg-warm-cardMuted/50 border-warm-border hover:bg-white'
                      }`}
                    >
                      <span>✅ {isHinglish ? 'Nahi! Yeh bilkul saaf biological tissue hai' : 'No! It is healthy, clean biological tissue'}</span>
                    </button>
                  </div>
                  {quizAnswers[1] === 2 && (
                    <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHinglish ? 'Bilkul Sahi! Period blood bilkul saaf hota hai aur healthy growing body ka saboot hai.' : 'Exactly right! It is completely clean and a sign of a strong, healthy body.'}</span>
                    </div>
                  )}
                </div>

                {/* Question 2 */}
                <div className="bg-white/90 p-4 rounded-2xl border border-warm-border shadow-xs">
                  <span className="text-xs font-bold text-brand-800 block mb-1">
                    {isHinglish ? 'Sawaal 2: Kya period ke dauran sar dhona aur nahana chahiye?' : 'Question 2: Can you take a warm bath or wash your hair during your period?'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setQuizAnswers(prev => ({ ...prev, 2: 1 }))}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                        quizAnswers[2] === 1 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' 
                          : 'bg-warm-cardMuted/50 border-warm-border hover:bg-white'
                      }`}
                    >
                      <span>✅ {isHinglish ? 'Haan! Gunguna paani dard kam karta hai' : 'Yes! Warm water relieves cramps & refreshes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizAnswers(prev => ({ ...prev, 2: 2 }))}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                        quizAnswers[2] === 2 
                          ? 'bg-rose-50 border-rose-300 text-rose-800' 
                          : 'bg-warm-cardMuted/50 border-warm-border hover:bg-white'
                      }`}
                    >
                      <span>❌ {isHinglish ? 'Nahi, nahane se flow band ho jata hai' : 'No, you must never wash your hair'}</span>
                    </button>
                  </div>
                  {quizAnswers[2] === 1 && (
                    <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHinglish ? 'Superb! Gunguna shower pelvic muscles ko relax karta hai aur fresh feel karwata hai.' : 'Brilliant! A warm shower relaxes uterine muscles and keeps you totally fresh.'}</span>
                    </div>
                  )}
                </div>

                {/* Question 3 */}
                <div className="bg-white/90 p-4 rounded-2xl border border-warm-border shadow-xs">
                  <span className="text-xs font-bold text-brand-800 block mb-1">
                    {isHinglish ? 'Sawaal 3: Used sanitary pad ko kahan phenkna chahiye?' : 'Question 3: How should you dispose of a used sanitary pad?'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setQuizAnswers(prev => ({ ...prev, 3: 1 }))}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                        quizAnswers[3] === 1 
                          ? 'bg-rose-50 border-rose-300 text-rose-800' 
                          : 'bg-warm-cardMuted/50 border-warm-border hover:bg-white'
                      }`}
                    >
                      <span>❌ {isHinglish ? 'Toilet commode mein flush kar dein' : 'Flush it down the toilet flush'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizAnswers(prev => ({ ...prev, 3: 2 }))}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2 ${
                        quizAnswers[3] === 2 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' 
                          : 'bg-warm-cardMuted/50 border-warm-border hover:bg-white'
                      }`}
                    >
                      <span>✅ {isHinglish ? 'Kagaz mein lapetkar koodedaan (dustbin) mein daalein' : 'Roll in paper/wrapper and put in trash dustbin'}</span>
                    </button>
                  </div>
                  {quizAnswers[3] === 2 && (
                    <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isHinglish ? 'Bilkul Sahi! Flush karne se pipe block ho sakti hai, hamesha dustbin mein daalein.' : 'Perfect! Flushing clogs drains; rolling in paper and binning keeps sanitation safe.'}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* STANDARD EDUCATIONAL SLIDE BODY */
              <div className="space-y-4">
                {/* Paragraphs */}
                <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-white/60 space-y-2.5 text-xs sm:text-sm text-warm-textDark leading-relaxed">
                  <h4 className="font-bold text-sm text-brand-900 flex items-center gap-1.5">
                    <Sparkle className="w-4 h-4 text-brand-600" />
                    {activeContent.headline}
                  </h4>
                  {activeContent.body.map((para, i) => (
                    <p key={i} className="text-warm-textDark/90">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Key Takeaways Cards */}
                {activeContent.keyTakeaways.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeContent.keyTakeaways.map((item, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-2xl border border-warm-border shadow-soft flex flex-col justify-between">
                        <span className="text-xs font-bold text-brand-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          {item.label}
                        </span>
                        <p className="text-[11px] text-warm-textMuted mt-1 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro-Tip Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <span className="text-base shrink-0">💡</span>
                  <div>
                    <strong className="font-bold text-amber-950">
                      {isHinglish ? 'Golden Yaad Rakhne Wali Baat:' : 'Golden Takeaway:'}
                    </strong>{' '}
                    <span>{activeContent.proTip}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Action Footer */}
            <div className="mt-6 pt-4 border-t border-warm-border/50 flex items-center justify-between">
              <button
                type="button"
                onClick={prevSlide}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-white hover:bg-warm-border text-warm-textDark border border-warm-border transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isHinglish ? 'Peechhe' : 'Previous'}</span>
              </button>

              <div className="text-xs text-warm-textMuted font-medium">
                {isHinglish ? `Slide ${currentSlide + 1} / ${SLIDES.length}` : `Slide ${currentSlide + 1} of ${SLIDES.length}`}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition flex items-center gap-1.5"
              >
                <span>{currentSlide === SLIDES.length - 1 ? (isHinglish ? 'Pehle Slide Par Jayein ↺' : 'Restart from Slide 1 ↺') : (isHinglish ? 'Aage (Next) →' : 'Next Slide →')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
