import json
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_questions(role, difficulty):
    with open("dataset/questions.json") as f:
        questions = json.load(f)

    role_embedding = model.encode(role)

    scored = []

    for q in questions:
        if q["difficulty"] == difficulty:
            q_embed = model.encode(q["role"])
            similarity = np.dot(role_embedding, q_embed)
            scored.append((similarity, q))

    scored.sort(reverse=True)

    selected = scored[:5]

    return {
        "questions": [q[1]["question"] for q in selected],
        "ideal_answers": [q[1]["ideal_answer"] for q in selected]
    }