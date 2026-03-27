import json
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def flatten_questions(raw):
    """
    Your JSON structure is: [ [ [ {question}, ... ], ... ], ... ]
    Level 0 → roles
    Level 1 → difficulty groups
    Level 2 → individual question dicts

    This flattens all three levels into a single list of dicts.
    """
    flat = []
    for role_group in raw:           # level 0 — per role
        for diff_group in role_group: # level 1 — per difficulty
            for question in diff_group: # level 2 — individual question
                if isinstance(question, dict):
                    flat.append(question)
    return flat


def generate_questions(role, difficulty):
    with open("dataset/interview_questions.json") as f:
        raw = json.load(f)

    # ✅ FIX: flatten the nested array before processing
    questions = flatten_questions(raw)

    role_embedding = model.encode(role)

    scored = []

    for q in questions:
        # Guard against missing keys
        if not all(k in q for k in ("difficulty", "role", "question", "ideal_answer")):
            continue

        if q["difficulty"].strip().lower() == difficulty.strip().lower():
            q_embed = model.encode(q["role"])
            # ✅ cast to plain float — prevents Python 3.13 tuple sort crash
            similarity = float(np.dot(role_embedding, q_embed))
            scored.append((similarity, q))

    # Fallback: if no difficulty match found, use all questions ranked by role similarity
    if not scored:
        for q in questions:
            if not all(k in q for k in ("role", "question", "ideal_answer")):
                continue
            q_embed = model.encode(q["role"])
            similarity = float(np.dot(role_embedding, q_embed))
            scored.append((similarity, q))

    # ✅ key=lambda avoids any numpy scalar comparison issue
    scored.sort(key=lambda x: x[0], reverse=True)

    selected = scored[:5]

    return {
        "questions": [q[1]["question"] for q in selected],
        "ideal_answers": [q[1]["ideal_answer"] for q in selected],
    }