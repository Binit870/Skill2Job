from fastapi import FastAPI, UploadFile, File
from analysis_service import analyze_resume
from services.question_selector import generate_questions
from services.answer_scorer import evaluate_answers

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    return await analyze_resume(file)

@app.post("/generate")
def generate(data: dict):
    role = data["role"]
    difficulty = data.get("difficulty", "medium")
    return generate_questions(role, difficulty)

@app.post("/evaluate")
def evaluate(data: dict):
    role = data["role"]
    responses = data["responses"]
    return evaluate_answers(role, responses)