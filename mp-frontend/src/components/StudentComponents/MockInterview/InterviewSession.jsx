import { useState, useEffect, useRef } from "react";
import RobotAvatar from "./RobotAvatar";
import { evaluateInterview } from "../../../services/mockInterviewService";

export default function InterviewSession({
  role,
  questions,
  responses,
  setResponses,
  setFeedback,
  setStep,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const speakQuestion = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.pitch = 1;

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => {
      setIsSpeaking(false);
      startListening();
    };
    speech.onerror = () => setIsSpeaking(false);

    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let finalTranscript = "";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const t = event.results[event.results.length - 1][0].transcript;
      finalTranscript += " " + t;
      setTranscript(finalTranscript.trim());
      resetSilenceTimer(finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      handleAnswer(finalTranscript);
    };

    recognition.onerror = () => setIsListening(false);

    recognition.start();
    resetSilenceTimer(finalTranscript);
  };

  const resetSilenceTimer = (currentAnswer) => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      recognitionRef.current?.stop();
    }, 5000);
  };

  const handleAnswer = (answerText) => {
    setTranscript("");
    setResponses((prev) => {
      const updated = [...prev, {
        question: questions[currentIndex],
        student_answer: answerText.trim(),
      }];
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((c) => c + 1);
      } else {
        submitInterview(updated);
      }
      return updated;
    });
  };

  const submitInterview = async (allResponses) => {
    setLoading(true);
    const speech = new SpeechSynthesisUtterance("Thank you. Evaluating your performance now.");
    setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);

    try {
      const data = await evaluateInterview({ role, responses: allResponses });
      setFeedback(data);
      setStep("feedback");
    } catch (err) {
      alert("Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      window.speechSynthesis.cancel();
      setTranscript("");
      speakQuestion(`Question ${currentIndex + 1}. ${questions[currentIndex]}`);
    }
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.stop();
    };
  }, [currentIndex, questions]);

  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div style={{
      background: "#fff", borderRadius: 20, border: "1px solid #d1fae5",
      boxShadow: "0 4px 24px rgba(16,185,129,0.08)", overflow: "hidden"
    }}>

      {/* Top bar - question progress */}
      <div style={{ background: "#f0fdf4", borderBottom: "1px solid #d1fae5", padding: "14px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#065f46",
            background: "#d1fae5", padding: "3px 10px", borderRadius: 20, border: "1px solid #a7f3d0"
          }}>
            {role}
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: "#d1fae5", borderRadius: 3 }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg, #10b981, #059669)",
            width: `${progress}%`, borderRadius: 3, transition: "width 0.5s ease"
          }} />
        </div>
      </div>

      <div style={{ padding: "36px 40px" }}>

        {/* Robot + Question side by side on wider screens */}
        <div style={{ display: "flex", gap: 32, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>

          {/* Robot */}
          <div style={{ flexShrink: 0 }}>
            <RobotAvatar isSpeaking={isSpeaking} isListening={isListening} />
          </div>

          {/* Question bubble */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              background: "#f0fdf4", borderRadius: 16, border: "1px solid #d1fae5",
              padding: "20px 24px", position: "relative"
            }}>
              {/* Speech bubble tail */}
              <div style={{
                position: "absolute", left: -10, top: "50%", transform: "translateY(-50%)",
                width: 0, height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "10px solid #d1fae5"
              }} />
              <div style={{
                position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
                width: 0, height: 0,
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
                borderRight: "9px solid #f0fdf4"
              }} />

              <p style={{ fontSize: 13, fontWeight: 600, color: "#10b981", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Question {currentIndex + 1}
              </p>
              <p style={{ fontSize: 17, fontWeight: 500, color: "#064e35", lineHeight: 1.6, margin: 0 }}>
                {questions[currentIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Transcript live preview */}
        <div style={{
          background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0",
          padding: "14px 18px", minHeight: 64, marginBottom: 20,
          position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            {/* Mic icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={isListening ? "#3b82f6" : "#9ca3af"} />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke={isListening ? "#3b82f6" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: isListening ? "#3b82f6" : "#9ca3af" }}>
              {isListening ? "Recording your answer..." : isSpeaking ? "Listen to the question..." : "Waiting..."}
            </span>

            {isListening && (
              <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 3, borderRadius: 2, background: "#3b82f6",
                    animation: `bar${i} 0.6s ease-in-out infinite ${i * 0.15}s`,
                    height: 12
                  }} />
                ))}
                <style>{`
                  @keyframes bar0 { 0%,100%{height:4px} 50%{height:14px} }
                  @keyframes bar1 { 0%,100%{height:8px} 50%{height:18px} }
                  @keyframes bar2 { 0%,100%{height:6px} 50%{height:16px} }
                  @keyframes bar3 { 0%,100%{height:4px} 50%{height:12px} }
                `}</style>
              </div>
            )}
          </div>
          <p style={{ fontSize: 14, color: transcript ? "#1f2937" : "#9ca3af", margin: 0, fontStyle: transcript ? "normal" : "italic", lineHeight: 1.6 }}>
            {transcript || "Your answer will appear here as you speak..."}
          </p>
        </div>

        {/* Silence hint */}
        <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", margin: 0 }}>
          {isListening ? "Speak clearly • Auto-submits after 5 seconds of silence" : isSpeaking ? "Listen to the question, then answer automatically" : loading ? "Evaluating your performance..." : ""}
        </p>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 20 }}>
            <div style={{
              width: 24, height: 24, border: "3px solid #d1fae5",
              borderTopColor: "#10b981", borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <span style={{ color: "#059669", fontSize: 14, fontWeight: 500 }}>Generating your report...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}