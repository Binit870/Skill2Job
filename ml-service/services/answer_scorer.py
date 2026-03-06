import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def evaluate_answers(role, responses):

    with open("dataset/questions.json") as f:
        questions_data = json.load(f)

    results = []
    total_score = 0

    for item in responses:
        question = item["question"]
        student_answer = item["student_answer"]

        # 🔎 Find correct ideal answer from dataset
        ideal_answer = None
        for q in questions_data:
            if q["question"].strip().lower() == question.strip().lower() and q["role"].strip().lower() == role.strip().lower():
                ideal_answer = q["ideal_answer"]
                break

        if not ideal_answer:
            ideal_answer = ""

        # Encode
        ideal_emb = model.encode(ideal_answer)
        student_emb = model.encode(student_answer)

        similarity = cosine_similarity(
            [ideal_emb], [student_emb]
        )[0][0]

        # 🔥 Better scoring formula
        score = round(similarity * 10)

        # Prevent fake 10/10
        if similarity < 0.3:
            score = 2
        elif similarity < 0.5:
            score = 4
        elif similarity < 0.7:
            score = 6
        elif similarity < 0.85:
            score = 8
        else:
            score = 9

        total_score += score

        results.append({
            "question": question,
            "score": score
        })

    overall_score = round(total_score / len(responses))

    return {
        "overall_score": overall_score,
        "results": results
    }