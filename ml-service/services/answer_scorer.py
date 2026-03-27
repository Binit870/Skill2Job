import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def flatten_questions(raw):
    """Flatten [ [ [ {question} ] ] ] → [ {question} ]"""
    flat = []
    for role_group in raw:
        for diff_group in role_group:
            for question in diff_group:
                if isinstance(question, dict):
                    flat.append(question)
    return flat


def _normalize(text: str) -> str:
    return text.strip().lower()


def evaluate_answers(role, responses):
    with open("dataset/interview_questions.json") as f:
        raw = json.load(f)

    # ✅ FIX: flatten before lookup — previously iterating over nested arrays
    questions_data = flatten_questions(raw)

    results = []
    total_score = 0

    for item in responses:
        question = item["question"]
        student_answer = item.get("student_answer", "").strip()

        # Pass 1: match question + role (normalized)
        ideal_answer = None
        for q in questions_data:
            if (
                _normalize(q.get("question", "")) == _normalize(question)
                and _normalize(q.get("role", "")) == _normalize(role)
            ):
                ideal_answer = q.get("ideal_answer", "")
                break

        # Pass 2: match question text only (ignore role)
        if not ideal_answer:
            for q in questions_data:
                if _normalize(q.get("question", "")) == _normalize(question):
                    ideal_answer = q.get("ideal_answer", "")
                    break

        # Pass 3: last resort — use question itself
        if not ideal_answer:
            ideal_answer = question

        # Empty answer → score 0 immediately
        if not student_answer:
            results.append({
                "question": question,
                "score": 0,
                "feedback": "No answer was recorded."
            })
            total_score += 0
            continue

        # Encode and score
        ideal_emb = model.encode(ideal_answer)
        student_emb = model.encode(student_answer)
        similarity = float(cosine_similarity([ideal_emb], [student_emb])[0][0])

        if similarity < 0.3:
            score = 2
            feedback = "Answer needs significant improvement."
        elif similarity < 0.5:
            score = 4
            feedback = "Partially correct — try to be more specific."
        elif similarity < 0.7:
            score = 6
            feedback = "Good answer with room to improve."
        elif similarity < 0.85:
            score = 8
            feedback = "Strong answer, covers most key points."
        else:
            score = 9
            feedback = "Excellent answer!"

        total_score += score
        results.append({
            "question": question,
            "score": score,
            "feedback": feedback
        })

    overall_score = round(total_score / len(responses)) if responses else 0

    return {
        "overall_score": overall_score,
        "results": results,
    }