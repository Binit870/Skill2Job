import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Load dataset
data = pd.read_csv("dataset.csv")

X_text = data["resume_text"]
y = data["placed"]

# TF-IDF
vectorizer = TfidfVectorizer(max_features=3000)
X = vectorizer.fit_transform(X_text)

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save
joblib.dump(model, "../app/models/placement_model.pkl")
joblib.dump(vectorizer, "../app/models/vectorizer.pkl")

print("Placement model trained and saved.")
