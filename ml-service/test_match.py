from resume_parser import extract_text_from_resume
from job_matcher import match_jobs

resume_text = extract_text_from_resume("sample_resume.pdf")
results = match_jobs(resume_text)

print(results[["title", "match_score"]])
