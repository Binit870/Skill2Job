"""
job_match_service.py

Matches a resume against a SPECIFIC job description (not a general ATS
score) — the "Job Description Analyzer" feature: paste or select a JD,
get an explainable match score against exactly that role.

Combines two signals into one weighted score, same idea as a standard
"explainable resume-job match" approach:
  - skill_coverage   (60%): what fraction of the JD's required skills
                             appear in the resume
  - semantic_similarity (40%): overall semantic closeness between the
                             two texts, using the same sentence-transformer
                             model already used elsewhere in this service

(Dropped the third "project evidence" component from the original 3-way
split for now — that needs the resume's project section isolated
separately from its full text, which needs matching resume-parsing work.
Easy to add later if wanted.)
"""

from typing import List
from profile_extractor import extract_skills

# Reuse whatever sentence-transformer model + cosine similarity utility
# your analysis_service.py already loads — DO NOT load a second copy of
# the model, that doubles memory for no benefit. Import it from wherever
# it's currently instantiated, e.g.:
#
#   from analysis_service import model  # or wherever `model` is defined
#
# and delete the placeholder below once wired up correctly.
model = None  # PLACEHOLDER — replace with the real import


def _semantic_similarity(text_a: str, text_b: str) -> float:
    """Returns a 0–100 semantic similarity score between two texts."""
    if model is None:
        raise RuntimeError(
            "job_match_service.model is a placeholder — import the real "
            "sentence-transformer model from analysis_service before using this."
        )
    embeddings = model.encode([text_a, text_b])
    from sklearn.metrics.pairwise import cosine_similarity
    sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    # cosine similarity is -1..1; clamp and scale to 0..100
    return round(max(0, min(1, sim)) * 100, 1)


def _skill_coverage(resume_text: str, jd_skills: List[str]) -> tuple[float, list, list]:
    """Returns (coverage_percent, matched_skills, missing_skills)."""
    if not jd_skills:
        return 0.0, [], []
    resume_skills_lower = {s.lower() for s in extract_skills(resume_text)}
    matched = [s for s in jd_skills if s.lower() in resume_skills_lower]
    missing = [s for s in jd_skills if s.lower() not in resume_skills_lower]
    coverage = round(len(matched) / len(jd_skills) * 100, 1)
    return coverage, matched, missing


def match_resume_to_job(resume_text: str, job_description: str) -> dict:
    """
    Main entry point. `job_description` can be a full pasted JD, or just
    a role title / short skill list — extract_skills() degrades gracefully
    either way (it just finds fewer skill keywords in a shorter text).
    """
    jd_skills = extract_skills(job_description)
    coverage, matched_skills, missing_skills = _skill_coverage(resume_text, jd_skills)
    semantic_score = _semantic_similarity(resume_text, job_description)

    weighted_score = round(0.60 * coverage + 0.40 * semantic_score, 1)

    return {
        "match_score": weighted_score,
        "skill_coverage": coverage,
        "semantic_similarity": semantic_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "note": "Estimated resume-to-job similarity, not a guarantee of interview or hiring outcome.",
    }