from job_skills import JOB_SKILLS

def calculate_ats_score(resume_skills, job_title):
    required_skills = JOB_SKILLS.get(job_title, [])

    if not required_skills:
        return 0, []

    matched = set(resume_skills).intersection(set(required_skills))
    missing = set(required_skills) - matched

    ats_score = (len(matched) / len(required_skills)) * 100

    return round(ats_score, 2), list(missing)
