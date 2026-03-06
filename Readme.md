# 🚀 Skill2Job - Transforming Skills Into Careers

## 📌 Overview
This project is a **MERN stack application integrated with Machine Learning** that helps students and job seekers transform their skills into successful careers  
It provides:
- 🎤 **Mock Interviews with Voice Interaction**
- 📝 **Resume Parsing & ATS Score Analysis**
- 📊 **Placement Prediction**
- 🧩 **Skill Gap Analysis**
- 📈 **Personalized Recommendations**

The goal is to simulate real-world interview scenarios, analyze resumes against job descriptions, and provide actionable insights for career growth.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** – Interactive UI
- **Redux / Context API** – State management
- **TailwindCSS ** – Styling
- **React-Speech-Recognition** – Voice input for mock interviews
- **Chart.js / Plotly** – Visualizations

### Backend
- **Node.js + Express.js** – REST API
- **MongoDB + Mongoose** – Database for resumes, interview logs, predictions
- **Socket.io** – Real-time interview simulation

### Machine Learning (Python)
- **scikit-learn, XGBoost, LightGBM** – Placement prediction models
- **TensorFlow / PyTorch** – Deep learning for NLP and voice models
- **spaCy, NLTK, Transformers (Hugging Face)** – Resume parsing & skill extraction
- **Whisper / Vosk** – Speech-to-text for interview answers
- **gTTS / pyttsx3** – Text-to-speech for interviewer questions

---

## 📂 Project Structure

--


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Binit870/Skill2Job.git
cd Skill2Job

cd mp-frontend
npm install

cd ../mp-backend
npm install

cd ../ml-service
pip install -r requirements.txt

cd mp-frontend
npm start

cd mp-backend
npm run dev

cd ml-service
uvicorn main:app --reload



