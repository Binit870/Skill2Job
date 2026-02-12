import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# load jobs
jobs = pd.read_csv("jobs.csv")

# vectorizer (this IS the ML model)
vectorizer = TfidfVectorizer(stop_words="english")

# fit on job descriptions
job_vectors = vectorizer.fit_transform(jobs["description"])

def match_jobs(resume_text, top_n=3):
    resume_vector = vectorizer.transform([resume_text])
    scores = cosine_similarity(resume_vector, job_vectors)[0]

    jobs["match_score"] = (scores * 100).round(2)
    return jobs.sort_values("match_score", ascending=False).head(top_n)
