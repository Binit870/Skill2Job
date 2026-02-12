from resume_parser import extract_text_from_resume
from skill_extractor import extract_skills

resume_text = extract_text_from_resume("sample_resume.pdf")
skills = extract_skills(resume_text)

print("Extracted Skills:")
print(skills)
