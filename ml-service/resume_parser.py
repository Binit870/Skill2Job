import pdfplumber
from clean_text import clean_resume_text

def extract_text_from_resume(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return clean_resume_text(text)

if __name__ == "__main__":
    resume_text = extract_text_from_resume("sample_resume.pdf")
    print(resume_text)
