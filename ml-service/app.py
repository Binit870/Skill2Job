# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import PyPDF2

# app = Flask(__name__)
# CORS(app)

# @app.route('/health', methods=['GET'])
# def health():
#     return jsonify({"status": "ok", "service": "ML Resume Analyzer"})

# @app.route('/analyze', methods=['POST'])
# def analyze():
#     try:
#         if 'file' not in request.files:
#             return jsonify({"error": "No file provided"}), 400
        
#         file = request.files['file']
        
#         # Extract text from PDF
#         pdf_reader = PyPDF2.PdfReader(file)
#         text = ""
#         for page in pdf_reader.pages:
#             text += page.extract_text() or ""
        
#         # Simple analysis
#         skills_list = ['python', 'java', 'react', 'sql', 'javascript']
#         found_skills = [skill for skill in skills_list if skill in text.lower()]
        
#         ats_score = len(found_skills) * 20
#         placement_prob = len(found_skills) / len(skills_list)
        
#         return jsonify({
#             "ats_score": ats_score,
#             "placement_probability": placement_prob,
#             "missing_skills": [],
#             "found_skills": found_skills
#         })
        
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     print("🚀 ML Service starting...")
#     app.run(host='0.0.0.0', port=8000, debug=True)