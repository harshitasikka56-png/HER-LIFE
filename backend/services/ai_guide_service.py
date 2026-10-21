"""
HER LIFE — AI Health Education Assistant ("HER LIFE Guide")
Evidence-based conversational health education grounded in vetted clinical guidelines:
- ACOG (American College of Obstetricians and Gynecologists)
- Monash International PCOS Guidelines
- North American Menopause Society (NAMS)
- Endocrine Society & NHS Women's Health
"""

import re
from typing import Dict, Any, List

KNOWLEDGE_BASE = [
    {
        "keywords": ["pcos", "polycystic", "cysts", "hirsutism", "facial hair", "androgen"],
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
        "sources": [
            "International Evidence-Based Guideline for the Assessment and Management of PCOS (Monash University, 2023)",
            "ACOG Practice Bulletin No. 194: Polycystic Ovary Syndrome",
            "Endocrine Society Clinical Practice Guidelines"
        ],
        "recommended_questions": [
            "What tests are recommended to evaluate PCOS symptoms?",
            "What questions should I ask my gynecologist about irregular periods?",
            "How does stress interact with cycle regularity?"
        ]
    },
    {
        "keywords": ["cortisol", "stress", "adrenal", "hormone test", "cushing"],
        "title": "Stress, Cortisol, and Hormonal Interaction",
        "response": (
            "Cortisol is a vital glucocorticoid hormone produced by the adrenal glands that follows a circadian rhythm (typically peaking in the morning around 8:00 AM and declining toward midnight).\n\n"
            "Important scientific distinction:\n"
            "• **Self-reported emotional stress** and **laboratory-measured cortisol** are not the same thing. One cannot infer laboratory cortisol levels from stress scores, fatigue, or mood.\n"
            "• Chronic stress can impact the hypothalamic-pituitary-ovarian (HPO) axis, sometimes leading to delayed ovulation or cycle fluctuations.\n"
            "• A clinical cortisol test requires controlled collection timing (e.g. morning serum draw, late-night salivary cortisol, or 24-hour urine) and should only be evaluated by a healthcare professional in clinical context."
        ),
        "sources": [
            "Endocrine Society: Clinical Assessment of Hypercortisolemia and Adrenal Function",
            "ACOG Committee Opinion: Impact of Stress and Sleep on Menstrual Health"
        ],
        "recommended_questions": [
            "Why does stress delay ovulation or my period?",
            "What lifestyle habits support adrenal and hormone balance?",
            "How do I prepare for a hormone laboratory test?"
        ]
    },
    {
        "keywords": ["phases", "menstrual cycle", "follicular", "luteal", "ovulation", "cycle day"],
        "title": "The Four Phases of the Menstrual Cycle",
        "response": (
            "The menstrual cycle consists of continuous hormonal interplay across four key phases:\n\n"
            "1. **Menstrual Phase (Days 1–5 approx)**: Begins on the first day of full bleeding. Estrogen and progesterone are at baseline.\n"
            "2. **Follicular Phase (Days 1–13 approx)**: The pituitary gland releases Follicle-Stimulating Hormone (FSH), stimulating ovarian follicles. Rising estrogen rebuilds the uterine lining.\n"
            "3. **Ovulatory Phase (Around Day 14 in a 28-day cycle)**: A surge in Luteinizing Hormone (LH) triggers the release of a mature egg from an ovary.\n"
            "4. **Luteal Phase (Days 15–28 approx)**: The empty follicle becomes the corpus luteum, producing progesterone to support a potential pregnancy. If conception does not occur, progesterone drops, signaling the next period."
        ),
        "sources": [
            "ACOG FAQ049: Your Menstrual Cycle",
            "NHS: The Menstrual Cycle and Hormones"
        ],
        "recommended_questions": [
            "Why is calendar-based ovulation tracking only an estimate?",
            "What causes cramps during the menstrual phase?",
            "How can I tell what cycle phase I am currently in?"
        ]
    },
    {
        "keywords": ["perimenopause", "menopause", "hot flash", "night sweat", "flushes", "brain fog"],
        "title": "Perimenopause and Menopause Transition",
        "response": (
            "**Perimenopause** is the natural transition leading up to menopause, usually starting in a person's 40s (though it can begin earlier). During this phase, fluctuating estrogen and progesterone levels cause variable cycle lengths, missed periods, vasomotor symptoms (hot flashes, night sweats), sleep changes, and brain fog.\n\n"
            "**Menopause** is clinically defined as having reached 12 consecutive months without a menstrual period (with no other medical cause), with an average age of 51.\n\n"
            "Safety reminder: Any vaginal bleeding or spotting that occurs AFTER menopause (after 12 period-free months) is not normal and requires prompt medical evaluation to rule out endometrial pathology."
        ),
        "sources": [
            "The 2023 Nonhormone Therapy Position Statement (The Menopause Society / NAMS)",
            "ACOG Clinical Consensus No. 3: General Approaches to Medical Management of Menstrual Suppression and Perimenopause"
        ],
        "recommended_questions": [
            "What are common non-hormonal strategies for hot flashes?",
            "How does bone health change after menopause?",
            "When should post-menopausal bleeding be evaluated?"
        ]
    },
    {
        "keywords": ["cramp", "pain", "dysmenorrhea", "endometriosis", "pelvic pain"],
        "title": "Period Pain and Pelvic Discomfort",
        "response": (
            "Menstrual cramps (dysmenorrhea) are caused by prostaglandins—chemical compounds that trigger uterine muscle contractions to shed the lining.\n\n"
            "• **Primary Dysmenorrhea**: Common cramping without an underlying pelvic condition, typically starting shortly before or with bleeding and subsiding within 48–72 hours.\n"
            "• **Secondary Dysmenorrhea**: Pelvic pain associated with conditions such as endometriosis, adenomyosis, or fibroids. Red flags include pain that radiates to the back or legs, pain with bowel movements or urination, deep pain during intercourse, or cramps that do not respond to over-the-counter pain relievers.\n\n"
            "You should not have to 'just deal with' debilitating pain. Severe cramps warrant a conversation with a clinician."
        ),
        "sources": [
            "ACOG FAQ046: Dysmenorrhea (Painful Periods)",
            "World Health Organization (WHO): Endometriosis Fact Sheet"
        ],
        "recommended_questions": [
            "What is the difference between normal cramps and endometriosis?",
            "What pain management options can I discuss with my doctor?",
            "What questions should I bring to an appointment about pelvic pain?"
        ]
    },
    {
        "keywords": ["first period", "teen", "puberty", "menarche", "backpack", "pads", "tampons"],
        "title": "Puberty & First Menstrual Period (Menarche)",
        "response": (
            "Menarche (your first period) typically occurs between ages 10 and 15, approximately 2 to 2.5 years after breast development begins.\n\n"
            "Helpful reminders for young users:\n"
            "• It is completely normal for periods to be irregular, lighter, or spaced months apart during the first 2 to 3 years as your reproductive hormones mature.\n"
            "• Period products include disposable or organic pads, menstrual cups, tampons, and period underwear. Choose whichever feels most comfortable for you.\n"
            "• Carrying a small wellness pouch in your backpack with a couple of pads and spare underwear helps you feel secure wherever you go.\n"
            "• Always feel free to ask a trusted adult, parent, school nurse, or doctor any questions."
        ),
        "sources": [
            "ACOG Committee Opinion No. 651: Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign",
            "American Academy of Pediatrics (AAP): Menarche Guidance"
        ],
        "recommended_questions": [
            "How do I choose between pads and tampons?",
            "Why is my period irregular in the first year?",
            "What can help ease school-day menstrual cramps?"
        ]
    },
    {
        "keywords": ["doctor", "gynecologist", "appointment", "checklist", "questions"],
        "title": "Preparing for a Healthcare Appointment",
        "response": (
            "Bringing organized symptom records to your healthcare provider helps them understand your experience faster.\n\n"
            "Recommended questions to discuss with your gynecologist:\n"
            "1. 'Here is my cycle log for the past 6 months. Do you notice any patterns concerning cycle length or flow?'\n"
            "2. 'My most disruptive symptoms are [insert symptoms, e.g. severe cramps, acne, or fatigue]. Could these indicate an underlying condition like PCOS or endometriosis?'\n"
            "3. 'Would blood tests (such as total and free testosterone, DHEA-S, thyroid TSH, or prolactin) or a pelvic ultrasound be appropriate for my symptoms?'\n"
            "4. 'What evidence-based lifestyle or medical treatments can help reduce my symptoms?'"
        ),
        "sources": [
            "ACOG Patient Education: Partnering with Your Ob-Gyn",
            "Mayo Clinic: Tips for Talking to Your Doctor About Women's Health"
        ],
        "recommended_questions": [
            "How do I export my HER LIFE symptom summary for my doctor?",
            "What lab tests are commonly ordered for menstrual irregularity?",
            "What warning signs require immediate emergency care?"
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
    "sources": [
        "ACOG Women's Health Knowledge Library",
        "World Health Organization (WHO) Reproductive Health"
    ],
    "recommended_questions": [
        "What are the four phases of the menstrual cycle?",
        "What are the symptoms and diagnostic criteria for PCOS?",
        "How can I tell normal cramps from secondary dysmenorrhea?",
        "What happens during perimenopause?"
    ]
}


def answer_health_query(user: Any, query: str) -> Dict[str, Any]:
    """
    Matches user query to vetted knowledge base and enriches with ethical medical disclaimers.
    """
    clean_q = query.lower()
    
    # Check for emergency/urgent symptoms
    emergency_pattern = r"(fainted|fainting|passed out|emergency|bleeding through pad in an hour|unbearable pain|chest pain|severe hemorrhag)"
    if re.search(emergency_pattern, clean_q):
        return {
            "title": "Important Safety Alert",
            "reply": (
                "⚠️ **URGENT MEDICAL NOTICE**\n\n"
                "The symptoms you described may require prompt or emergency medical assessment. "
                "HER LIFE Guide cannot replace in-person healthcare.\n\n"
                "Please seek immediate medical care or contact local emergency services (e.g. 911, 999, 112, or your local emergency number) if you experience:\n"
                "• Soaking through one or more menstrual pads/tampons every hour for 2 or more consecutive hours\n"
                "• Sudden, severe pelvic pain or dizziness and fainting\n"
                "• Suspected complications during pregnancy\n"
                "• High fever accompanied by foul-smelling vaginal discharge\n\n"
                "Please reach out to an emergency room or your nearest healthcare facility immediately."
            ),
            "sources": ["ACOG Emergency Evaluation Criteria for Acute Pelvic Pain and Abnormal Uterine Bleeding"],
            "recommended_questions": ["Find local emergency medical services", "What constitutes severe uterine hemorrhage?"],
            "medical_disclaimer": "HER LIFE is an educational companion and does not provide emergency triage or medical diagnoses."
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
        return {
            "title": best_match["title"],
            "reply": best_match["response"],
            "sources": best_match["sources"],
            "recommended_questions": best_match["recommended_questions"],
            "medical_disclaimer": "Educational information only. Not a medical diagnosis or prescription. Consult your healthcare provider for clinical advice."
        }
    else:
        return {
            "title": DEFAULT_RESPONSE["title"],
            "reply": DEFAULT_RESPONSE["response"],
            "sources": DEFAULT_RESPONSE["sources"],
            "recommended_questions": DEFAULT_RESPONSE["recommended_questions"],
            "medical_disclaimer": "Educational information only. Consult your healthcare provider for individualized care."
        }
