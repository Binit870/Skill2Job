from fastapi import FastAPI, UploadFile, File
from analysis_service import analyze_resume

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    return await analyze_resume(file)