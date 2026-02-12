import re

def clean_resume_text(text):
    text = text.lower()                      # lowercase
    text = re.sub(r'\n+', ' ', text)         # remove line breaks
    text = re.sub(r'[^a-z0-9\s]', ' ', text) # remove symbols
    text = re.sub(r'\s+', ' ', text)         # remove extra spaces
    return text.strip()
