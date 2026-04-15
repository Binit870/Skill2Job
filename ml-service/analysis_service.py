# analysis_service.py
import os
import tempfile
from fastapi import HTTPException
from resume_parser import extract_text
from ml_models import get_sklearn_models

# Skills to check for in resume text
KNOWN_SKILLS = [
    "python", "java", "javascript", "react", "node", "nodejs", "sql", "mongodb",
    "postgresql", "mysql", "aws", "azure", "gcp", "docker", "kubernetes", "git",
    "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy",
    "django", "flask", "fastapi", "typescript", "html", "css", "c++", "golang",
    "spring", "express", "redux", "graphql", "rest", "api", "linux", "ci/cd",
]

def compute_missing_skills(text: str) -> list[str]:
    text_lower = text.lower()
    return [s for s in KNOWN_SKILLS if s not in text_lower]

async def analyze_resume(file):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        text = extract_text(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {str(e)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)   # always cleaned up now

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text found in PDF. It may be a scanned image — use a text-based PDF."
        )

    placement_model, ats_model, vectorizer = get_sklearn_models()
    vector = vectorizer.transform([text])

    placement_prob = float(placement_model.predict_proba(vector)[0][1] * 100)
    ats_score      = float(ats_model.predict(vector)[0])
    ats_score      = max(0.0, min(100.0, ats_score))   # clamp to valid range

    missing = compute_missing_skills(text)

    return {
        "placement_probability": round(placement_prob, 1),
        "ats_score":             round(ats_score, 1),
        "missing_skills":        missing[:10],  # top 10 only
    }