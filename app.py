# Optional: FastAPI parity endpoint for suggest-prompts
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI()

class ChatMessage(BaseModel):
    role: str
    content: str

class UIHint(BaseModel):
    n: Optional[int] = 3
    language: Optional[str] = "en"
    style: Optional[str] = "concise"

class ClientInfo(BaseModel):
    session_id: Optional[str]
    app_version: Optional[str]

class Suggestion(BaseModel):
    text: str
    confidence: Optional[float] = None
    reason: Optional[str] = None

class SuggestRequest(BaseModel):
    current_draft: str
    chat_history: List[ChatMessage] = []
    ui_hint: Optional[UIHint] = None
    client: Optional[ClientInfo] = None

class SuggestResponse(BaseModel):
    suggestions: List[Suggestion] = Field(default_factory=list)

@app.post("/api/suggest-prompts", response_model=SuggestResponse)
async def suggest_prompts(_: SuggestRequest):
    # Parity placeholder: return empty suggestions. Real logic mirrors Edge route.
    return SuggestResponse(suggestions=[])