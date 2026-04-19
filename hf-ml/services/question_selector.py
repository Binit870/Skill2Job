# services/question_selector.py
import json
import os
import functools
import numpy as np
from ml_models import get_sentence_model

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "interview_questions.json")

@functools.lru_cache(maxsize=1)
def _load_questions() -> list:
    with open(DATASET_PATH, encoding="utf-8") as f:
        raw = json.load(f)
    flat = []
    for role_group in raw:
        for diff_group in role_group:
            for q in diff_group:
                if isinstance(q, dict):
                    flat.append(q)
    return flat

def generate_questions(role: str, difficulty: str) -> dict:
    model = get_sentence_model()
    questions = _load_questions()

    # Filter by difficulty first
    filtered = [
        q for q in questions
        if all(k in q for k in ("difficulty", "role", "question", "ideal_answer"))
        and q["difficulty"].strip().lower() == difficulty.strip().lower()
    ]
    if not filtered:
        filtered = [
            q for q in questions
            if all(k in q for k in ("role", "question", "ideal_answer"))
        ]

    # Batch-encode all unique roles at once (9 encodes, not 282)
    unique_roles = list({q["role"] for q in filtered})
    role_emb     = model.encode(role)
    role_embs    = model.encode(unique_roles)
    role_sim_map = {r: float(np.dot(role_emb, e)) for r, e in zip(unique_roles, role_embs)}

    # Score and sort — highest similarity first
    scored = sorted(filtered, key=lambda q: role_sim_map.get(q["role"], 0), reverse=True)

    # Take top 20, then randomly sample 10 for variety
    import random
    top = scored[:20]
    selected = random.sample(top, min(10, len(top)))

    return {
        "questions":     [q["question"]    for q in selected],
        "ideal_answers": [q["ideal_answer"] for q in selected],
    }