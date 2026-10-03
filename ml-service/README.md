---
title: Skill2Career ML Service
emoji: 🤖
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# ml-service

FastAPI service powering resume analysis, mock interviews, and mock assessments for Skill2Career. Called exclusively by `mp-backend` (never directly by the frontend), using a shared internal API key.

See the [project root README](../README.md) for full documentation: architecture, environment variables, features, and security model.

## Quick start

```bash or powershell
python -m venv venv && source venv/bin/activate
        or
python -m venv venv
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env   # set INTERNAL_API_KEY (must match mp-backend's ML_INTERNAL_API_KEY)
uvicorn main:app --reload --port 8000
```

The first request that needs the sentence-transformer model will trigger a download from Hugging Face — expect a slower first call.
