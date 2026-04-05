import json
import random

def load_questions():
    with open("dataset/assessment_questions.json") as f:
        return json.load(f)

TOPIC_ALIASES = {
    "aptitude":        "aptitude",
    "reasoning":       "reasoning",
    "verbal":          "verbal",
    "technical":       "technical",
    "coding":          "technical",
    "ml":              "ml",
    "machine learning":"ml",
}

def generate_assessment(
    topic: str,
    num_questions: int = 10,
    time_per_question: int = 30,
    tf_ratio: float = 0.3,
):
    data = load_questions()
    key  = TOPIC_ALIASES.get(topic.strip().lower())

    if not key or key not in data:
        all_mcq, all_tf = [], []
        for v in data.values():
            all_mcq.extend(v.get("mcq", []))
            all_tf.extend(v.get("truefalse", []))
    else:
        all_mcq = list(data[key]["mcq"])          # explicit key — never falls back to missing
        all_tf  = list(data[key]["truefalse"])

    # --- compute split ---
    # Clamp tf_ratio to valid range
    tf_ratio = max(0.0, min(tf_ratio, 1.0))

    n_tf  = min(round(num_questions * tf_ratio), len(all_tf))
    n_mcq = min(num_questions - n_tf, len(all_mcq))

    # re-balance if pool is smaller than requested
    shortfall = num_questions - n_tf - n_mcq
    if shortfall > 0:
        extra_mcq = min(shortfall, len(all_mcq) - n_mcq)
        n_mcq    += extra_mcq
        shortfall -= extra_mcq
    if shortfall > 0:
        extra_tf = min(shortfall, len(all_tf) - n_tf)
        n_tf    += extra_tf

    random.shuffle(all_mcq)
    random.shuffle(all_tf)

    pool = []

    # Build MCQ entries (type field set explicitly — NOT inferred from keys)
    for q in all_mcq[:n_mcq]:
        pool.append({
            "type":        "mcq",
            "question":    q["question"],
            "options":     q["options"],
            "answer":      q["answer"],
            "explanation": q.get("explanation", ""),
            "time_limit":  time_per_question,
        })

    # Build T/F entries
    for q in all_tf[:n_tf]:
        pool.append({
            "type":        "truefalse",
            "question":    q["question"],
            "options":     ["True", "False"],   # always provide options
            "answer":      q["answer"],
            "explanation": q.get("explanation", ""),
            "time_limit":  time_per_question,
        })

    random.shuffle(pool)

    for i, q in enumerate(pool):
        q["id"] = i + 1

    return {
        "topic":            topic,
        "total_questions":  len(pool),
        "time_per_question": time_per_question,
        "mcq_count":        n_mcq,
        "tf_count":         n_tf,
        "questions":        pool,
    }