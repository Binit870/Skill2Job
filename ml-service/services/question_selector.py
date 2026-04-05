import json
from sentence_transformers import SentenceTransformer
import numpy as np
import random  # ✅ NEW

model = SentenceTransformer("all-MiniLM-L6-v2")


def flatten_questions(raw):
    flat = []
    for role_group in raw:
        for diff_group in role_group:
            for question in diff_group:
                if isinstance(question, dict):
                    flat.append(question)
    return flat


def generate_questions(role, difficulty):
    with open("dataset/interview_questions.json") as f:
        raw = json.load(f)

    questions = flatten_questions(raw)

    role_embedding = model.encode(role)

    filtered = []

    # ✅ Step 1: filter by difficulty
    for q in questions:
        if not all(k in q for k in ("difficulty", "role", "question", "ideal_answer")):
            continue

        if q["difficulty"].strip().lower() == difficulty.strip().lower():
            filtered.append(q)

    # ✅ Step 2: fallback if empty
    if not filtered:
        filtered = [
            q for q in questions
            if all(k in q for k in ("role", "question", "ideal_answer"))
        ]

    # ✅ Step 3: OPTIONAL — still bias toward role similarity
    scored = []
    for q in filtered:
        q_embed = model.encode(q["role"])
        similarity = float(np.dot(role_embedding, q_embed))
        scored.append((similarity, q))

    # 🔥 KEY CHANGE:
    # Instead of taking top 5 → randomly pick from scored list
    random.shuffle(scored)

    selected = scored[:10]

    return {
        "questions": [q[1]["question"] for q in selected],
        "ideal_answers": [q[1]["ideal_answer"] for q in selected],
    }