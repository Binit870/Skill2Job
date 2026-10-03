# main.py
import os
import logging
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, File, Request, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from analysis_service import analyze_resume
from services.question_selector import generate_questions
from services.answer_scorer import evaluate_answers
from services.assessment_generator import generate_assessment
from services.assessment_scorer import score_assessment

logger = logging.getLogger("ml-service")
logging.basicConfig(level=logging.INFO)


# Rate-limit per end-user rather than per IP. Every call to this service
# comes from the single Node backend server, so a plain per-IP limit would
# lump every user in the app into one shared bucket. The backend forwards
# the original user's ID in X-User-Id; fall back to remote IP for any
# request that somehow doesn't carry it (defense in depth — the Node
# backend already rate-limits per user before it ever gets here).
def rate_limit_key(request: Request) -> str:
    user_id = request.headers.get("x-user-id")
    return user_id if user_id else get_remote_address(request)

limiter = Limiter(key_func=rate_limit_key)

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

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Add your backend Render URL here. BACKEND_URL env var must be set on Render.
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        BACKEND_URL,
        "http://localhost:5000",          # keep for local dev
        "https://Skill2Career-3jds.onrender.com",   # your backend — hardcoded fallback
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the full exception server-side only. Previously `str(exc)` was
    # sent straight back to the client, which can leak internal file paths,
    # library versions, and other implementation details to anyone probing
    # the API.
    logger.exception(f"Unhandled error on {request.method} {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )


# ── Internal auth ────────────────────────────────────────────────────────────
# This service has no user-facing auth of its own — it's meant to be called
# only by the Node backend, which already enforces login + rate limiting.
# Without this check, anyone who discovers the ML service's URL (e.g. its
# Render subdomain) could call these — often expensive, model-backed —
# endpoints directly, completely bypassing the backend's auth and any rate
# limiting. INTERNAL_API_KEY must be set to the same value on both this
# service and the Node backend (as ML_INTERNAL_API_KEY).
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")


async def require_internal_key(x_internal_api_key: Optional[str] = Header(default=None)):
    if not INTERNAL_API_KEY:
        # Fail loud in any environment where the key isn't configured, rather
        # than silently running with no protection at all.
        logger.warning("INTERNAL_API_KEY is not set — refusing request for safety.")
        raise HTTPException(status_code=503, detail="Service not configured")
    if x_internal_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

# ─── Resume ───────────────────────────────────────────────────────────────────
@app.post("/analyze", dependencies=[Depends(require_internal_key)])
@limiter.limit("40/hour")
async def analyze(request: Request, file: UploadFile = File(...)):
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

@app.post("/generate", dependencies=[Depends(require_internal_key)])
@limiter.limit("40/hour")
def generate(request: Request, data: GenerateRequest):
    return generate_questions(data.role, data.difficulty)

@app.post("/evaluate", dependencies=[Depends(require_internal_key)])
@limiter.limit("40/hour")
def evaluate(request: Request, data: EvaluateRequest):
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

@app.post("/assessment/generate", dependencies=[Depends(require_internal_key)])
@limiter.limit("40/hour")
def assessment_generate(request: Request, data: AssessmentGenerateRequest):
    return generate_assessment(
        data.topic,
        data.num_questions,
        data.time_per_question,
        data.tf_ratio
    )

@app.post("/assessment/evaluate", dependencies=[Depends(require_internal_key)])
@limiter.limit("40/hour")
def assessment_evaluate(request: Request, data: AssessmentSubmitRequest):
    return score_assessment(
        data.topic,
        [r.model_dump() for r in data.responses],
        data.total_time_taken
    )

# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "ML Service"}

# Add this right after the /health route at the bottom
@app.get("/")
def root():
    return {"status": "ok"}