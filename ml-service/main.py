from fastapi import FastAPI, UploadFile, File
from analysis_service import analyze_resume
from services.question_selector import generate_questions
from services.answer_scorer import evaluate_answers

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    return await analyze_resume(file)

from pydantic import BaseModel
from typing import List, Optional

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
    return evaluate_answers(data.role, [r.dict() for r in data.responses])


# @app.post("/generate")
# def generate(data: dict):
#     role = data["role"]
#     difficulty = data.get("difficulty", "medium")
#     return generate_questions(role, difficulty)

# @app.post("/evaluate")
# def evaluate(data: dict): 
#     role = data["role"]
#     responses = data["responses"]
#     return evaluate_answers(role, responses)