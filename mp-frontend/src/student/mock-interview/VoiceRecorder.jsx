import { useState } from "react";
 
export function VoiceRecorder({ onAnswer }) {
  const [listening, setListening] = useState(false);
 
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);
    recognition.onresult = (event) => {
      onAnswer(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
  };
 
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <button
        onClick={startRecording}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 28px",
          borderRadius: 14,
          border: "none",
          background: listening
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: listening
            ? "0 4px 18px rgba(239,68,68,0.4)"
            : "0 4px 18px rgba(16,185,129,0.4)",
          transition: "all 0.2s",
          fontFamily: "inherit",
          letterSpacing: "0.01em",
          minWidth: 200,
          justifyContent: "center",
        }}
      >
        {/* Mic icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#fff" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {listening ? "Listening..." : "Answer with Voice"}
 
        {/* Pulse dot when listening */}
        {listening && (
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#fff",
            animation: "pulse 0.8s ease-in-out infinite",
          }} />
        )}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.6); }
          }
        `}</style>
      </button>
    </div>
  );
}
