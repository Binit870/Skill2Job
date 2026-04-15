# main.py
import os
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager

from analysis_service import analyze_resume
from services.question_selector import generate_questions
from services.answer_scorer import evaluate_answers
from services.assessment_generator import generate_assessment
from services.assessment_scorer import score_assessment

# ── Preload the heavy model at startup so the first request doesn't time out ──
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Preloading sentence-transformer model...")
    from ml_models import get_sentence_model, get_sklearn_models
    get_sentence_model()      # downloads / loads all-MiniLM-L6-v2
    get_sklearn_models()      # loads placement_model, ats_model, vectorizer
    print("✅ Models ready.")
    yield

app = FastAPI(lifespan=lifespan)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Add your backend Render URL here. BACKEND_URL env var must be set on Render.
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        BACKEND_URL,
        "http://localhost:5000",          # keep for local dev
        "https://skill2job-3jds.onrender.com",   # your backend — hardcoded fallback
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

# ─── Resume ───────────────────────────────────────────────────────────────────
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    return await analyze_resume(file)

# ─── Mock Interview ───────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    role: str
    difficulty: Optional[str] = "medium"

class QAPair(BaseModel):
    question: str
    student_answer: str

class EvaluateRequest(BaseModel):
    role: str
    responses: List[QAPair]

@app.post("/generate")
def generate(data: GenerateRequest):
    return generate_questions(data.role, data.difficulty)

@app.post("/evaluate")
def evaluate(data: EvaluateRequest):
    return evaluate_answers(data.role, [r.model_dump() for r in data.responses])

# ─── Mock Assessment ──────────────────────────────────────────────────────────
class AssessmentGenerateRequest(BaseModel):
    topic: str
    num_questions: Optional[int] = 10
    time_per_question: Optional[int] = 30
    tf_ratio: Optional[float] = 0.3

class MCQResponse(BaseModel):
    question: str
    type: Optional[str] = "mcq"
    selected_option: Optional[str] = None
    correct_answer: str
    explanation: Optional[str] = ""
    time_taken: Optional[int] = 0
    timed_out: Optional[bool] = False

class AssessmentSubmitRequest(BaseModel):
    topic: str
    responses: List[MCQResponse]
    total_time_taken: Optional[int] = 0

@app.post("/assessment/generate")
def assessment_generate(data: AssessmentGenerateRequest):
    return generate_assessment(
        data.topic,
        data.num_questions,
        data.time_per_question,
        data.tf_ratio
    )

@app.post("/assessment/evaluate")
def assessment_evaluate(data: AssessmentSubmitRequest):
    return score_assessment(
        data.topic,
        [r.model_dump() for r in data.responses],
        data.total_time_taken
    )

# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "ML Service"}