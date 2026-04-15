# ml_models.py
import os
import joblib
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

_sentence_model = None
_placement_model = None
_ats_model = None
_vectorizer = None

def get_sentence_model() -> SentenceTransformer:
    global _sentence_model
    if _sentence_model is None:
        _sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _sentence_model

def get_sklearn_models():
    global _placement_model, _ats_model, _vectorizer
    if _placement_model is None:
        models_dir = os.path.join(BASE_DIR, "models")
        _placement_model = joblib.load(os.path.join(models_dir, "placement_model.pkl"))
        _ats_model       = joblib.load(os.path.join(models_dir, "ats_model.pkl"))
        _vectorizer      = joblib.load(os.path.join(models_dir, "vectorizer.pkl"))
    return _placement_model, _ats_model, _vectorizer