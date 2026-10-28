"""
HER LIFE — AI Health Education Assistant Router
"""

import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.database import get_db, AIChatHistory, User
from schemas.schemas import AIChatRequest, AIChatResponse
from services.ai_guide_service import answer_health_query

router = APIRouter(prefix="/api/ai", tags=["HER LIFE AI Guide"])


@router.post("/ask", response_model=AIChatResponse)
def ask_ai_guide(user_id: str, req: AIChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Fallback to demo user
        user = db.query(User).first()

    # Get vetted answer
    result = answer_health_query(
        user=user, 
        query=req.message, 
        language=req.language, 
        chat_context=req.chat_context
    )

    # Save to history
    user_msg = AIChatHistory(
        id=f"msg_{uuid.uuid4().hex[:12]}",
        user_id=user.id if user else "anonymous",
        role="user",
        content=req.message
    )
    ai_msg = AIChatHistory(
        id=f"msg_{uuid.uuid4().hex[:12]}",
        user_id=user.id if user else "anonymous",
        role="assistant",
        content=result["reply"],
        sources="; ".join(result.get("sources", []))
    )
    db.add(user_msg)
    db.add(ai_msg)
    db.commit()

    return AIChatResponse(
        reply=result["reply"],
        sources=result.get("sources", []),
        recommended_questions=result.get("recommended_questions", []),
        medical_disclaimer=result.get("medical_disclaimer", "Educational information only.")
    )


@router.get("/history")
def get_chat_history(user_id: str, limit: int = 20, db: Session = Depends(get_db)):
    chats = db.query(AIChatHistory).filter(
        AIChatHistory.user_id == user_id
    ).order_by(AIChatHistory.timestamp.asc()).limit(limit).all()

    return [
        {
            "id": c.id,
            "role": c.role,
            "content": c.content,
            "sources": c.sources.split("; ") if c.sources else [],
            "timestamp": c.timestamp.isoformat()
        }
        for c in chats
    ]


@router.get("/tts")
def stream_text_to_speech(text: str, lang: str = "en"):
    """
    Multilingual Text-to-Speech audio streaming endpoint.
    Converts educational guidance into natural spoken MP3 audio.
    """
    import io
    from fastapi.responses import Response
    from gtts import gTTS

    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    clean_text = text.replace("*", "").replace("#", "").replace("`", "").strip()[:500]

    # Map language codes to gTTS supported tags
    lang_map = {
        "en": "en",
        "hi": "hi",
        "hinglish": "hi",
        "pa": "pa",
        "bn": "bn",
        "ta": "ta",
        "te": "te",
        "mr": "mr",
        "gu": "gu",
        "ur": "ur",
        "kn": "kn",
        "ml": "ml"
    }
    tts_lang = lang_map.get(lang.lower(), "en")
    tld = "co.in" if tts_lang in ["en", "hi"] else "com"

    try:
        tts = gTTS(text=clean_text, lang=tts_lang, tld=tld)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return Response(content=fp.read(), media_type="audio/mpeg")
    except Exception as e:
        try:
            tts = gTTS(text=clean_text, lang="en", tld="com")
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return Response(content=fp.read(), media_type="audio/mpeg")
        except Exception:
            raise HTTPException(status_code=500, detail="TTS generation failed")
