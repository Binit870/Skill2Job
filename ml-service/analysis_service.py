import joblib
import tempfile
import os
from resume_parser import extract_text

# Load models
placement_model = joblib.load("models/placement_model.pkl")
ats_model = joblib.load("models/ats_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

async def analyze_resume(file):
    contents = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    text = extract_text(tmp_path)
    os.remove(tmp_path)

    vector = vectorizer.transform([text])

    placement_prob = placement_model.predict_proba(vector)[0][1]
    ats_score = ats_model.predict(vector)[0]

    return {
        "placement_probability": float(placement_prob * 100),
        "ats_score": float(ats_score),
        "missing_skills": []
    }
