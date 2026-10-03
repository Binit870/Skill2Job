"""
profile_extractor.py

Extracts structured profile fields (name, email, phone, skills, education)
from raw resume text. Uses regex + keyword matching — no extra dependencies
beyond what's already in requirements.txt.

This is a heuristic extractor, not a full NLP pipeline. It will get most
straightforward resumes right, but unusual formats (heavily designed
templates, non-standard section headers, scanned/image PDFs with poor text
extraction) may need a human to fix a field or two — which is exactly why
the onboarding flow always lets the user review/edit their profile
afterward rather than blindly trusting this.
"""

import re

# ── Common tech/professional skills to look for ──────────────────────────
# Extend this list freely — it's a plain Python list, no retraining needed.
SKILL_KEYWORDS = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "R", "MATLAB", "SQL",
    # Frontend
    "React", "React.js", "Angular", "Vue", "Vue.js", "Next.js", "HTML", "CSS",
    "Tailwind", "Tailwind CSS", "Bootstrap", "Redux", "jQuery", "Sass",
    # Backend
    "Node.js", "Express", "Express.js", "Django", "Flask", "FastAPI", "Spring",
    "Spring Boot", ".NET", "Laravel", "Ruby on Rails",
    # Databases
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Firebase",
    "Oracle", "Cassandra", "DynamoDB",
    # Cloud / DevOps
    "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
    "CI/CD", "Terraform", "Ansible", "Linux", "Git", "GitHub", "GitLab",
    # Data / ML
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
    "scikit-learn", "Pandas", "NumPy", "Data Analysis", "Data Science",
    "Power BI", "Tableau", "Excel", "NLP", "Computer Vision",
    # Mobile
    "React Native", "Flutter", "Android", "iOS", "Swift UI",
    # Other
    "REST API", "GraphQL", "Microservices", "Agile", "Scrum", "Figma",
    "UI/UX", "Testing", "Jest", "Cypress", "Selenium",
]

EDUCATION_KEYWORDS = [
    "B.Tech", "B.E.", "Bachelor", "M.Tech", "M.E.", "Master", "MBA", "MCA",
    "BCA", "B.Sc", "M.Sc", "B.Com", "BBA", "PhD", "Diploma",
    "University", "College", "Institute", "School of",
]

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

# Matches Indian-style numbers: optional +91, optional space/dash, 10 digits
# (also tolerates a leading 0). Adjust/extend if you need other formats.
PHONE_RE = re.compile(r"(?:\+91[\s-]?)?[0]?[6-9]\d{9}\b")


def extract_email(text: str) -> str | None:
    match = EMAIL_RE.search(text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    match = PHONE_RE.search(text)
    return match.group(0) if match else None


def extract_name(text: str) -> str | None:
    """
    Heuristic: the name is almost always the first non-empty line of a
    resume, and it won't contain '@', digits, or common header words like
    'resume' / 'curriculum vitae'. Falls back to None if nothing fits —
    the frontend leaves the name field blank for the user to fill in rather
    than guessing wrong.
    """
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for line in lines[:5]:  # only check the first few lines
        lower = line.lower()
        if "@" in line or any(ch.isdigit() for ch in line):
            continue
        if any(word in lower for word in ["resume", "curriculum vitae", "cv"]):
            continue
        if 2 <= len(line.split()) <= 5 and len(line) < 60:
            return line.title()
    return None


def extract_skills(text: str) -> list[str]:
    """Case-insensitive whole-word match against SKILL_KEYWORDS."""
    found = []
    lower_text = text.lower()
    for skill in SKILL_KEYWORDS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, lower_text):
            found.append(skill)
    # de-duplicate near-identical entries (e.g. "React" and "React.js")
    seen = set()
    deduped = []
    for s in found:
        key = s.lower().replace(".", "").replace(" ", "")
        if key not in seen:
            seen.add(key)
            deduped.append(s)
    return deduped


def extract_education(text: str) -> list[str]:
    """
    Returns lines that look like education entries — contain a degree
    keyword or an institution-type keyword. Deliberately returns raw lines
    rather than trying to split into {institution, degree, year} fields,
    since that structure varies too much across resume formats to guess
    reliably. The frontend can show these as-is, or the user can copy the
    relevant bits into the structured Resume Builder fields.
    """
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    matches = []
    for line in lines:
        if any(kw.lower() in line.lower() for kw in EDUCATION_KEYWORDS):
            if len(line) < 150:  # skip accidental paragraph-length matches
                matches.append(line)
    return matches[:5]  # cap it — avoids pulling in unrelated long sections


def extract_profile_fields(text: str) -> dict:
    """
    Main entry point. Call this with the resume's raw extracted text
    (whatever your existing PDF-text-extraction step already produces)
    and merge the result into analyze_resume()'s existing return dict.
    """
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "education": extract_education(text),
    }