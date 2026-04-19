# services/answer_scorer.py
import os
import functools
from sklearn.metrics.pairwise import cosine_similarity
from ml_models import get_sentence_model

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "interview_questions.json")

@functools.lru_cache(maxsize=1)
def _load_questions() -> list:
    import json
    with open(DATASET_PATH, encoding="utf-8") as f:
        raw = json.load(f)
    flat = []
    for role_group in raw:
        for diff_group in role_group:
            for q in diff_group:
                if isinstance(q, dict):
                    flat.append(q)
    return flat

def _normalize(text: str) -> str:
    return text.strip().lower()

def evaluate_answers(role: str, responses: list) -> dict:
    model = get_sentence_model()
    questions_data = _load_questions()

    results = []
    total_score = 0

    for item in responses:
        question       = item["question"]
        student_answer = item.get("student_answer", "").strip()

        # Find ideal answer — role+question match first, then question only
        ideal_answer = None
        for q in questions_data:
            if _normalize(q.get("question","")) == _normalize(question):
                if _normalize(q.get("role","")) == _normalize(role):
                    ideal_answer = q.get("ideal_answer","")
                    break
        if not ideal_answer:
            for q in questions_data:
                if _normalize(q.get("question","")) == _normalize(question):
                    ideal_answer = q.get("ideal_answer","")
                    break

        # No reference answer found AND no student answer → skip gracefully
        if not ideal_answer:
            results.append({
                "question": question,
                "score":    0,
                "feedback": "Reference answer not found for this question."
            })
            continue

        # Empty student answer
        if not student_answer:
            results.append({"question": question, "score": 0, "feedback": "No answer was recorded."})
            continue

        ideal_emb   = model.encode(ideal_answer)
        student_emb = model.encode(student_answer)
        similarity  = float(cosine_similarity([ideal_emb], [student_emb])[0][0])

        if   similarity < 0.3:  score, feedback = 2, "Answer needs significant improvement."
        elif similarity < 0.5:  score, feedback = 4, "Partially correct — try to be more specific."
        elif similarity < 0.7:  score, feedback = 6, "Good answer with room to improve."
        elif similarity < 0.85: score, feedback = 8, "Strong answer, covers most key points."
        else:                   score, feedback = 9, "Excellent answer!"

        total_score += score
        results.append({"question": question, "score": score, "feedback": feedback})

    overall_score = round(total_score / len(responses)) if responses else 0
    return {"overall_score": overall_score, "results": results}