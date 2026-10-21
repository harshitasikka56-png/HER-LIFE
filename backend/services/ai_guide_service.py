"""
HER LIFE — AI Health Education Assistant ("HER LIFE Guide")
Evidence-based conversational health education grounded in vetted clinical guidelines:
- ACOG (American College of Obstetricians and Gynecologists)
- Monash International PCOS Guidelines
- North American Menopause Society (NAMS)
- Endocrine Society & NHS Women's Health

Supports both English and friendly, accessible everyday Hinglish!
"""

import re
from typing import Dict, Any, List

KNOWLEDGE_BASE = [
    {
        "keywords": ["pcos", "polycystic", "cysts", "hirsutism", "facial hair", "androgen", "chehre par baal"],
        "title": "Polycystic Ovary Syndrome (PCOS) Awareness",
        "response": (
            "Polycystic Ovary Syndrome (PCOS) is a common endocrine condition characterized by hormonal imbalance. "
            "Under the internationally recognized Rotterdam criteria, a diagnosis generally requires at least two of the following: "
            "(1) irregular or absent ovulation/menstruation, (2) signs or biochemical markers of excess androgens (such as acne, hirsutism, or hair thinning), "
            "and (3) polycystic ovary morphology on ultrasound (with other conditions ruled out).\n\n"
            "Key considerations:\n"
            "• In adolescents, multi-follicular ovaries and mild cycle irregularity can be a normal part of pubertal development, so diagnostic guidelines advise caution.\n"
            "• Ultrasound findings alone do NOT make a diagnosis; ovaries often look polycystic in healthy young individuals.\n"
            "• Lifestyle strategies, balanced nutrition, stress reduction, and tailored medical therapies can effectively manage symptoms."
        ),
        "hinglish_response": (
            "**PCOS (Polycystic Ovary Syndrome) Kya Hai?**\n\n"
            "PCOS ek aam hormonal imbalance (hormone ka asantulan) hota hai. Doctor Rotterdam criteria ke tehat kam se kam 2 lakshan dekhkar check karte hain:\n"
            "1. **Periods irregular ya late aana** (ya kai mahine miss ho jana).\n"
            "2. **Androgens (male hormones) badhna** — jaise persistent acne/keel-muhase, chehre ya body par unwanted baal (hirsutism), ya sar ke baal patle hona.\n"
            "3. **Ultrasound mein ovaries mein chhote-chhote fluid follicles dikhna**.\n\n"
            "**Dhyan Rakhne Wali Baatein:**\n"
            "• Teenage ladkiyon mein periods pehle 2-3 saal irregular hona aam baat hoti hai, har irregular cycle PCOS nahi hoti.\n"
            "• Balanced diet (kam refined sugar), rozana 30 minute halki exercise, aur achhi neend se PCOS ko kaafi hadd tak control kiya ja sakta hai.\n"
            "• Sahi diagnosis ke liye gynecologist se hormone blood tests (jaise Total Testosterone, DHEA-S, TSH) karwayein."
        ),
        "sources": [
            "International Evidence-Based Guideline for the Assessment and Management of PCOS (Monash University, 2023)",
            "ACOG Practice Bulletin No. 194: Polycystic Ovary Syndrome",
            "Endocrine Society Clinical Practice Guidelines"
        ],
        "recommended_questions": [
            "What tests are recommended to evaluate PCOS symptoms?",
            "PCOS ke liye doctor se kya sawaal poochein?",
            "How does stress interact with cycle regularity?"
        ]
    },
    {
        "keywords": ["cramp", "pain", "dysmenorrhea", "endometriosis", "pelvic pain", "pet dard", "kamar dard", "dard"],
        "title": "Period Pain and Pelvic Discomfort",
        "response": (
            "Menstrual cramps (dysmenorrhea) are caused by prostaglandins—chemical compounds that trigger uterine muscle contractions to shed the lining.\n\n"
            "• **Primary Dysmenorrhea**: Common cramping without an underlying pelvic condition, typically starting shortly before or with bleeding and subsiding within 48–72 hours.\n"
            "• **Secondary Dysmenorrhea**: Pelvic pain associated with conditions such as endometriosis, adenomyosis, or fibroids. Red flags include pain that radiates to the back or legs, pain with bowel movements or urination, deep pain during intercourse, or cramps that do not respond to over-the-counter pain relievers.\n\n"
            "You should not have to 'just deal with' debilitating pain. Severe cramps warrant a conversation with a clinician."
        ),
        "hinglish_response": (
            "**Periods Mein Pet Aur Kamar Dard (Cramps) Kyun Hota Hai?**\n\n"
            "Periods ke dauran uterus (garbhashay) ki lining shed karne ke liye body 'Prostaglandins' naamak chemicals banati hai, jisse muscles contract hoti hain aur dard mehsoos hota hai.\n\n"
            "**Gharelu Aur Safe Upay:**\n"
            "• **Garam paani ki thaili (Hot water bottle / Heating pad)** pet ke nichle hisse par lagayein — isse muscle tension turant kam hoti hai.\n"
            "• **Gunguna paani ya adrak/tulsi ki chai** piyein jo bloating aur swelling kam kare.\n"
            "• **Halki stretching ya gentle walking** karein.\n\n"
            "⚠️ **Doctor Ko Kab Dikhayein:**\n"
            "Agar dard itna tez ho ki daily kaam ya school/college chhut jaye, ya standard pain medicines se bhi aaram na mile, toh doctor se Endometriosis ya fibroids ke liye check karwayein."
        ),
        "sources": [
            "ACOG FAQ046: Dysmenorrhea (Painful Periods)",
            "World Health Organization (WHO): Endometriosis Fact Sheet"
        ],
        "recommended_questions": [
            "Pet dard ke gharelu upay kya hain?",
            "Normal cramps aur endometriosis mein kya farak hai?",
            "When should I see a doctor for period pain?"
        ]
    },
    {
        "keywords": ["phases", "menstrual cycle", "follicular", "luteal", "ovulation", "cycle day", "cycle kaise kaam karta hai"],
        "title": "The Four Phases of the Menstrual Cycle",
        "response": (
            "The menstrual cycle consists of continuous hormonal interplay across four key phases:\n\n"
            "1. **Menstrual Phase (Days 1–5 approx)**: Begins on the first day of full bleeding. Estrogen and progesterone are at baseline.\n"
            "2. **Follicular Phase (Days 1–13 approx)**: The pituitary gland releases Follicle-Stimulating Hormone (FSH), stimulating ovarian follicles. Rising estrogen rebuilds the uterine lining.\n"
            "3. **Ovulatory Phase (Around Day 14 in a 28-day cycle)**: A surge in Luteinizing Hormone (LH) triggers the release of a mature egg from an ovary.\n"
            "4. **Luteal Phase (Days 15–28 approx)**: The empty follicle becomes the corpus luteum, producing progesterone to support a potential pregnancy. If conception does not occur, progesterone drops, signaling the next period."
        ),
        "hinglish_response": (
            "**Menstrual Cycle Ke 4 Mukhya Phases:**\n\n"
            "1. **Menstrual Phase (Din 1–5):** Pehle din bleeding shuru hoti hai. Estrogen aur progesterone dono hormones low hote hain, isliye thoda energy low reh sakta hai.\n"
            "2. **Follicular Phase (Din 6–13):** Bleeding band hone ke baad ovary mein nayi follicle banti hai aur estrogen badhta hai. Aap zyada energetic aur fresh mehsoos karti hain.\n"
            "3. **Ovulation Phase (Lagbhag Din 14):** Ek mature egg ovary se release hota hai. Yeh conceive karne (pregnant hone) ka sabse fertile time hota hai.\n"
            "4. **Luteal Phase (Din 15–28):** Progesterone hormone badhta hai. Agar pregnancy nahi hoti, toh hormones drop hote hain aur agle period ki taiyari shuru hoti hai (isi waqt bloating ya mood changes ho sakte hain)."
        ),
        "sources": [
            "ACOG FAQ049: Your Menstrual Cycle",
            "NHS: The Menstrual Cycle and Hormones"
        ],
        "recommended_questions": [
            "Ovulation ka pata kaise lagayein?",
            "What causes cramps during periods?",
            "Cycle phases ke hisaab se diet kya honi chahiye?"
        ]
    },
    {
        "keywords": ["first period", "teen", "puberty", "menarche", "backpack", "pads", "tampons", "pehla period"],
        "title": "Puberty & First Menstrual Period (Menarche)",
        "response": (
            "Menarche (your first period) typically occurs between ages 10 and 15, approximately 2 to 2.5 years after breast development begins.\n\n"
            "Helpful reminders for young users:\n"
            "• It is completely normal for periods to be irregular, lighter, or spaced months apart during the first 2 to 3 years as your reproductive hormones mature.\n"
            "• Period products include disposable or organic pads, menstrual cups, tampons, and period underwear. Choose whichever feels most comfortable for you.\n"
            "• Carrying a small wellness pouch in your backpack with a couple of pads and spare underwear helps you feel secure wherever you go.\n"
            "• Always feel free to ask a trusted adult, parent, school nurse, or doctor any questions."
        ),
        "hinglish_response": (
            "**Pehla Period (Menarche) Aur Zaroori Tips:**\n\n"
            "Pehla period aamtaur par 10 se 15 saal ki umar mein shuru hota hai. Yeh ekdam natural aur healthy sharirik badlav hai.\n\n"
            "**Important Baatein Jo Har Ladki Ko Pata Honi Chahiye:**\n"
            "• Pehle 2–3 saal periods bilkul fix timing par nahi aate. Kabhi 30 din, kabhi 45 din lag sakte hain — isme ghabrane ki bilkul zaroorat nahi hai.\n"
            "• Apne school/college backpack mein ek chhota pouch rakhein jisme 2 pads aur spare underwear ho.\n"
            "• Pad ko har 4 se 6 ghante mein badlein taaki hygiene aur infection se suraksha bani rahe.\n"
            "• Apni mummy, behen, trusted teacher ya doctor se khulkar baat karein."
        ),
        "sources": [
            "ACOG Committee Opinion No. 651: Menstruation in Girls and Adolescents",
            "American Academy of Pediatrics (AAP): Menarche Guidance"
        ],
        "recommended_questions": [
            "Pads kaise choose karein?",
            "Pehle period mein dard hone par kya karein?",
            "Periods miss hone par kya karein?"
        ]
    },
    {
        "keywords": ["cortisol", "stress", "adrenal", "hormone test", "cushing", "tension", "neend"],
        "title": "Stress, Cortisol, and Hormonal Interaction",
        "response": (
            "Cortisol is a vital glucocorticoid hormone produced by the adrenal glands that follows a circadian rhythm (typically peaking in the morning around 8:00 AM and declining toward midnight).\n\n"
            "Important scientific distinction:\n"
            "• **Self-reported emotional stress** and **laboratory-measured cortisol** are not the same thing. One cannot infer laboratory cortisol levels from stress scores, fatigue, or mood.\n"
            "• Chronic stress can impact the hypothalamic-pituitary-ovarian (HPO) axis, sometimes leading to delayed ovulation or cycle fluctuations.\n"
            "• A clinical cortisol test requires controlled collection timing and should only be evaluated by a healthcare professional."
        ),
        "hinglish_response": (
            "**Stress Aur Hormones Ka Aapas Mein Kya Connection Hai?**\n\n"
            "Jab hum zyada exam stress ya mental tension lete hain, toh body adrenal glands se stress signals release karti hai:\n"
            "• **Stress periods ko late kar sakta hai:** Zyada stress se brain ka hypothalamus signal slow ho jata hai, jisse ovulation delay ho sakta hai aur periods late aate hain.\n"
            "• **App stress score vs Lab Cortisol:** Yaad rahe, rozana ka stress score ek anubhav hai; lab ka cortisol test subah 8:00 AM khoon ki jaanch se hi pata chalta hai.\n"
            "• **Stress Kam Karne Ke Tips:** Roz 7-8 ghante ki uninterrupted neend lein, 10 minute deep breathing (pranayam) karein, aur raat ko sone se 1 ghanta pehle mobile screen band karein."
        ),
        "sources": [
            "Endocrine Society: Clinical Assessment of Adrenal Function",
            "ACOG Committee Opinion: Impact of Stress and Sleep on Menstrual Health"
        ],
        "recommended_questions": [
            "Tension se periods late kyun hote hain?",
            "Neend achhi aane ke natural tips kya hain?",
            "Cortisol test kaise karwaya jata hai?"
        ]
    }
]

DEFAULT_RESPONSE = {
    "title": "Women's Health Guidance",
    "response": (
        "HER LIFE Guide provides evidence-informed health education across menstrual cycles, fertility awareness, "
        "PCOS, lifestyle factors, and menopausal transitions.\n\n"
        "While I can explain physiological processes, symptom patterns, and suggested topics to discuss with your doctor, "
        "I am an educational tool and cannot diagnose medical conditions or prescribe treatments. "
        "If you are experiencing severe, worsening, or distressing symptoms, please consult a qualified healthcare professional."
    ),
    "hinglish_response": (
        "Main aapki **HER LIFE Guide (AI Saheli)** hoon!\n\n"
        "Main aapko periods, cramps, PCOS, ovulation, neend aur lifestyle se jude sawaalon ke evidence-based jawaab saral Hinglish mein de sakti hoon.\n\n"
        "⚠️ **Kripya Dhyan Dein:** Main ek educational assistant hoon, koi doctor ya dawai prescribe karne wali service nahi. Kisi bhi bimari ke pakke ilaaj ya tez dard ke liye doctor se sampark karein."
    ),
    "sources": [
        "ACOG Women's Health Knowledge Library",
        "World Health Organization (WHO) Reproductive Health"
    ],
    "recommended_questions": [
        "Periods ke dard ke gharelu upay?",
        "PCOS ke mukhya lakshan kya hain?",
        "Cycle ke 4 phases kya hote hain?",
        "Stress se periods late kyun hote hain?"
    ]
}


def is_hinglish_text(text: str) -> bool:
    hinglish_markers = [
        "dard", "kya", "kyun", "kaise", "hota", "hai", "karein", "batao", "pet",
        "kamar", "neend", "garmi", "paani", "gharelu", "upay", "aata", "saheli",
        "baal", "chehra", "theek", "din", "pehle", "baar"
    ]
    t = text.lower()
    return any(m in t for m in hinglish_markers)


def answer_health_query(user: Any, query: str) -> Dict[str, Any]:
    """
    Matches user query to vetted knowledge base and enriches with ethical medical disclaimers in English or Hinglish.
    """
    clean_q = query.lower()
    hinglish_detected = is_hinglish_text(clean_q)
    
    # Check for emergency/urgent symptoms
    emergency_pattern = r"(fainted|fainting|passed out|emergency|bleeding through pad in an hour|unbearable pain|chest pain|behosh|bahut zyada khoon)"
    if re.search(emergency_pattern, clean_q):
        if hinglish_detected:
            reply = (
                "⚠️ **ZAROORI EMERGENCY ALERT**\n\n"
                "Aapne jo lakshan bataye hain, unhe turant doctor ya emergency hospital mein dikhana zaroori hai:\n"
                "• 1-2 ghante mein lagatar pads poori tarah bheeg jana (heavy bleeding)\n"
                "• Achanak behoshi, chakkar aana ya seene mein dard\n"
                "• Asahaniya (unbearable) pet ya pelvic dard\n\n"
                "Kripya turant nazdeeki clinic ya emergency number (112 / ambulance) par call karein."
            )
            disclaimer = "HER LIFE emergency triage ya medical treatment provide nahi karta."
        else:
            reply = (
                "⚠️ **URGENT MEDICAL NOTICE**\n\n"
                "The symptoms you described may require prompt emergency medical assessment.\n"
                "Please seek immediate medical care if you experience heavy soaking bleeding (pad soaked every hour), fainting, or acute severe pain."
            )
            disclaimer = "HER LIFE is an educational companion and does not provide emergency triage."

        return {
            "title": "Emergency Medical Notice",
            "reply": reply,
            "sources": ["ACOG Emergency Evaluation Criteria for Abnormal Uterine Bleeding"],
            "recommended_questions": ["Find local emergency medical services"],
            "medical_disclaimer": disclaimer
        }

    # Match best knowledge entry
    best_match = None
    max_score = 0
    
    for entry in KNOWLEDGE_BASE:
        score = sum(1 for kw in entry["keywords"] if kw in clean_q)
        if score > max_score:
            max_score = score
            best_match = entry

    if best_match and max_score > 0:
        reply = best_match.get("hinglish_response") if hinglish_detected else best_match["response"]
        disclaimer = "Kripya dhyan dein: Yeh jaankari educational purpose ke liye hai, not a medical diagnosis. Clinical diagnosis ke liye doctor se consult karein." if hinglish_detected else "Educational information only. Not a medical diagnosis or prescription. Consult your healthcare provider for clinical advice."
        return {
            "title": best_match["title"],
            "reply": reply or best_match["response"],
            "sources": best_match["sources"],
            "recommended_questions": best_match["recommended_questions"],
            "medical_disclaimer": disclaimer
        }
    else:
        reply = DEFAULT_RESPONSE.get("hinglish_response") if hinglish_detected else DEFAULT_RESPONSE["response"]
        return {
            "title": DEFAULT_RESPONSE["title"],
            "reply": reply or DEFAULT_RESPONSE["response"],
            "sources": DEFAULT_RESPONSE["sources"],
            "recommended_questions": DEFAULT_RESPONSE["recommended_questions"],
            "medical_disclaimer": "Educational information only."
        }
