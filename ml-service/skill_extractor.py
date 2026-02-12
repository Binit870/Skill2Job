from skills import SKILLS

def extract_skills(resume_text):
    found_skills = []

    for skill in SKILLS:
        if skill in resume_text:
            found_skills.append(skill)

    return sorted(set(found_skills))
