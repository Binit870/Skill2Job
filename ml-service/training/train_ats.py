# In train_ats.py — replace the two joblib.dump lines:
import os
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(OUT_DIR, exist_ok=True)
joblib.dump(model,      os.path.join(OUT_DIR, "ats_model.pkl"))
joblib.dump(vectorizer, os.path.join(OUT_DIR, "vectorizer.pkl"))

# In train_placement.py — same fix:
import os
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(OUT_DIR, exist_ok=True)
joblib.dump(model,      os.path.join(OUT_DIR, "placement_model.pkl"))
# Note: do NOT save vectorizer here again — train_ats.py already saves it