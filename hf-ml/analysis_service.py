# analysis_service.py
import os
import tempfile
from fastapi import HTTPException
from resume_parser import extract_text
from ml_models import get_sklearn_models

# Skills to check for in resume text
ROLE_SKILLS = {
    "frontend":  ["react", "typescript", "html", "css", "redux", "javascript"],
    "backend":   ["node.js", "python", "java", "sql", "mongodb", "docker", "rest"],
    "ml":        ["python", "tensorflow", "pytorch", "pandas", "numpy", "machine learning"],
    "fullstack": ["react", "node.js", "sql", "docker", "git", "javascript"],
    "devops":    ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "linux"],
}

SKILL_IMPORTANCE = {
    "react": 90, "javascript": 95, "typescript": 85, "node.js": 88,
    "python": 92, "sql": 80, "mongodb": 75, "docker": 82,
    "kubernetes": 70, "aws": 78, "azure": 72, "gcp": 68,
    "tensorflow": 80, "pytorch": 78, "machine learning": 85,
    "html": 70, "css": 68, "git": 88, "rest": 75,
    "redux": 65, "pandas": 72, "numpy": 70, "java": 80,
    "linux": 65, "ci/cd": 72,
}

def detect_role(text_lower: str) -> str:
    scores = {
        role: sum(1 for s in skills if s in text_lower)
        for role, skills in ROLE_SKILLS.items()
    }
    return max(scores, key=scores.get)

def compute_missing_skills(text: str) -> list[dict]:
    text_lower = text.lower()
    role = detect_role(text_lower)
    relevant = ROLE_SKILLS[role]
    missing = [s for s in relevant if s not in text_lower]
    # Return with importance score
    return [
        {"skill": s, "importance": SKILL_IMPORTANCE.get(s, 60)}
        for s in missing
    ]

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
        "missing_skills":        [m["skill"] for m in missing[:10]],   # strings for DB
        "missing_skills_detail": missing[:10],   # with importance scores for frontend
    }