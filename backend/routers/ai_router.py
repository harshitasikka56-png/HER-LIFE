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
    result = answer_health_query(user, req.message)

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
