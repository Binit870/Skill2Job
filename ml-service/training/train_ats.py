import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
import joblib

data = pd.read_csv("dataset.csv")

X_text = data["resume_text"]
y = data["ats_score"]

vectorizer = TfidfVectorizer(max_features=3000)
X = vectorizer.fit_transform(X_text)

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, "../app/models/ats_model.pkl")
joblib.dump(vectorizer, "../app/models/vectorizer.pkl")

print("ATS model trained and saved.")
