import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/student/analyze", { state: res.data });
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "500px",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Resume ATS Analyzer</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Upload your resume and get instant ATS score & placement insights
        </p>

        {/* Upload Box */}
        <label
          style={{
            display: "block",
            border: "2px dashed #ccc",
            padding: "30px",
            borderRadius: "12px",
            cursor: "pointer",
            marginBottom: "20px",
            transition: "0.3s",
          }}
        >
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file ? (
            <>
              <p style={{ fontWeight: "bold", color: "#4CAF50" }}>
                ✅ {file.name}
              </p>
              <p style={{ fontSize: "12px", color: "#888" }}>
                Click to change file
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>
                Drag & Drop your resume here
              </p>
              <p style={{ fontSize: "13px", color: "#888" }}>
                or click to browse (PDF only)
              </p>
            </>
          )}
        </label>

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#999" : "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
        >
          {loading ? "Analyzing Resume..." : "Upload & Analyze"}
        </button>

        {loading && (
          <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
            Processing your resume... please wait ⏳
          </p>
        )}
      </div>
    </div>
  );
};

export default MyResume;
