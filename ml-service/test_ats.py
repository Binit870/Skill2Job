from resume_parser import extract_text_from_resume
from skill_extractor import extract_skills
from ats_scorer import calculate_ats_score

resume_text = extract_text_from_resume("sample_resume.pdf")
resume_skills = extract_skills(resume_text)

job_title = "Machine Learning Engineer"

score, missing_skills = calculate_ats_score(resume_skills, job_title)

print("Job Role:", job_title)
print("ATS Score:", score)
print("Missing Skills:", missing_skills)
