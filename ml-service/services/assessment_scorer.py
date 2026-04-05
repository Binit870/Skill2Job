def score_assessment(topic: str, responses: list, total_time_taken: int = 0):
    """
    Score MCQ + True/False responses.

    Each response dict:
        question        : str
        type            : 'mcq' | 'truefalse'
        selected_option : str | None
        correct_answer  : str
        explanation     : str
        time_taken      : int (seconds for this question)
        timed_out       : bool

    Returns:
        Full scoring result with per-question breakdown and grade.
    """
    results = []
    correct_count = 0
    mcq_correct = 0
    tf_correct = 0
    mcq_total = 0
    tf_total = 0
    total = len(responses)

    for item in responses:
        question      = item.get("question", "")
        qtype         = item.get("type", "mcq")
        selected      = (item.get("selected_option") or "").strip()
        correct       = (item.get("correct_answer") or "").strip()
        explanation   = item.get("explanation", "")
        time_taken    = item.get("time_taken", 0)
        timed_out     = item.get("timed_out", False)

        is_correct = (
            selected.lower() == correct.lower()
            and bool(selected)
            and not timed_out
        )

        if is_correct:
            correct_count += 1
            if qtype == "truefalse":
                tf_correct += 1
            else:
                mcq_correct += 1

        if qtype == "truefalse":
            tf_total += 1
        else:
            mcq_total += 1

        results.append({
            "question":        question,
            "type":            qtype,
            "selected_option": selected if selected else "Not answered",
            "correct_answer":  correct,
            "is_correct":      is_correct,
            "timed_out":       timed_out,
            "explanation":     explanation,
            "time_taken":      time_taken,
        })

    score_percent = round((correct_count / total) * 100) if total > 0 else 0

    # Grade
    if score_percent >= 90:
        grade, grade_label = "A+", "Outstanding"
    elif score_percent >= 80:
        grade, grade_label = "A",  "Excellent"
    elif score_percent >= 70:
        grade, grade_label = "B",  "Good"
    elif score_percent >= 60:
        grade, grade_label = "C",  "Average"
    elif score_percent >= 40:
        grade, grade_label = "D",  "Below Average"
    else:
        grade, grade_label = "F",  "Needs Improvement"

    return {
        "topic":            topic,
        "total_questions":  total,
        "correct":          correct_count,
        "wrong":            total - correct_count,
        "score_percent":    score_percent,
        "grade":            grade,
        "grade_label":      grade_label,
        "mcq_total":        mcq_total,
        "mcq_correct":      mcq_correct,
        "tf_total":         tf_total,
        "tf_correct":       tf_correct,
        "total_time_taken": total_time_taken,
        "results":          results,
    }