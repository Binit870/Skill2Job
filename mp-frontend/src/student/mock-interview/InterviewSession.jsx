import { useState, useEffect, useRef, useCallback } from "react";
import RobotAvatar from "./RobotAvatar";
import { evaluateInterview } from "../../services/mockInterviewService";

const SILENCE_TIMEOUT_MS = 12000;

export default function InterviewSession({
  role, questions, responses, setResponses, setFeedback, setStep,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [silenceCountdown, setSilenceCountdown] = useState(null);

  const isProcessing = useRef(false);
  const indexRef = useRef(0);
  const responsesRef = useRef([]);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => { indexRef.current = currentIndex; }, [currentIndex]);

  const startCountdown = () => {
    setSilenceCountdown(SILENCE_TIMEOUT_MS / 1000);
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setSilenceCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownIntervalRef.current); return null; }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCountdown = () => {
    clearInterval(countdownIntervalRef.current);
    setSilenceCountdown(SILENCE_TIMEOUT_MS / 1000);
    startCountdown();
  };

  const stopCountdown = () => {
    clearInterval(countdownIntervalRef.current);
    setSilenceCountdown(null);
  };

  const submitInterview = useCallback(async (allResponses) => {
    setEvaluating(true);
    window.speechSynthesis.cancel();
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
      setEvaluating(false);
    }
  }, [role, setFeedback, setStep]);

  const handleAnswer = useCallback((answerText) => {
    const idx = indexRef.current;
    const newEntry = { question: questions[idx], student_answer: answerText.trim() };
    const updated = [...responsesRef.current, newEntry];
    responsesRef.current = updated;
    setResponses(updated);
    setTranscript("");
    stopCountdown();
    if (idx + 1 < questions.length) {
      const next = idx + 1;
      indexRef.current = next;
      setCurrentIndex(next);
    } else {
      submitInterview(updated);
    }
  }, [questions, setResponses, submitInterview]);

  const handleManualSubmit = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (_) {} }
    clearTimeout(silenceTimerRef.current);
    stopCountdown();
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      isProcessing.current = false;
      return;
    }
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    let finalTranscript = "";
    let hasEnded = false;

    recognition.onstart = () => { setIsListening(true); startCountdown(); };

    recognition.onresult = (event) => {
      let interim = "";
      let newFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) newFinal += t + " ";
        else interim += t;
      }
      if (newFinal) finalTranscript += newFinal;
      setTranscript((finalTranscript + interim).trim());
      clearTimeout(silenceTimerRef.current);
      resetCountdown();
      silenceTimerRef.current = setTimeout(() => {
        try { recognition.stop(); } catch (_) {}
      }, SILENCE_TIMEOUT_MS);
    };

    recognition.onend = () => {
      if (hasEnded) return;
      hasEnded = true;
      setIsListening(false);
      stopCountdown();
      clearTimeout(silenceTimerRef.current);
      isProcessing.current = false;
      handleAnswer(finalTranscript);
    };

    recognition.onerror = (e) => {
      if (hasEnded) return;
      hasEnded = true;
      setIsListening(false);
      stopCountdown();
      isProcessing.current = false;
      if (e.error !== "no-speech") console.error("Speech recognition error:", e.error);
    };

    recognition.start();
    silenceTimerRef.current = setTimeout(() => {
      try { recognition.stop(); } catch (_) {}
    }, SILENCE_TIMEOUT_MS);
  }, [handleAnswer]);

  const speakQuestion = useCallback((text) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.92;
    speech.pitch = 1;
    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => { setIsSpeaking(false); startListening(); };
    speech.onerror = () => { setIsSpeaking(false); isProcessing.current = false; };
    window.speechSynthesis.speak(speech);
  }, [startListening]);

  useEffect(() => {
    if (!questions.length) return;
    isProcessing.current = false;
    const q = questions[currentIndex];
    if (!q) return;
    const timer = setTimeout(() => {
      speakQuestion(`Question ${currentIndex + 1}. ${q}`);
    }, 150);
    return () => {
      clearTimeout(timer);
      clearTimeout(silenceTimerRef.current);
      clearInterval(countdownIntervalRef.current);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} }
      isProcessing.current = false;
    };
  }, [currentIndex, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = (currentIndex / questions.length) * 100;
  const urgent = silenceCountdown !== null && silenceCountdown <= 3;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 24,
      border: "1px solid #d1fae5",
      boxShadow: "0 8px 32px rgba(16,185,129,0.1), 0 1px 3px rgba(0,0,0,0.04)",
      overflow: "hidden",
      width: "100%",
    }}>

      {/* Progress header */}
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
        borderBottom: "1px solid #d1fae5",
        padding: "14px clamp(16px,4vw,28px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#059669", letterSpacing: "0.02em" }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700, color: "#065f46",
            background: "#d1fae5", padding: "4px 12px", borderRadius: 20,
            border: "1px solid #a7f3d0", letterSpacing: "0.03em",
          }}>
            {role}
          </span>
        </div>
        <div style={{ height: 6, background: "#d1fae5", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #10b981, #059669)",
            width: `${progress}%`,
            borderRadius: 99,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      <div style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,40px)" }}>

        {/* Robot + speech bubble */}
        <div style={{
          display: "flex",
          gap: "clamp(16px,3vw,32px)",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
        }}>
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ maxWidth: 200 }}>
              <RobotAvatar isSpeaking={isSpeaking} isListening={isListening} />
            </div>
          </div>

          {/* Question bubble */}
          <div style={{
            flex: 1,
            minWidth: 0,
            background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
            borderRadius: 18,
            border: "1px solid #d1fae5",
            padding: "clamp(14px,3vw,22px) clamp(14px,3vw,24px)",
            width: "100%",
          }}>
            <p style={{
              fontSize: 11, fontWeight: 800, color: "#10b981",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
            }}>
              Question {currentIndex + 1}
            </p>
            <p style={{
              fontSize: "clamp(15px,2vw,17px)",
              fontWeight: 600,
              color: "#064e35",
              lineHeight: 1.65,
              margin: 0,
            }}>
              {questions[currentIndex]}
            </p>
          </div>
        </div>

        {/* Transcript box */}
        <div style={{
          background: isListening ? "#f0f9ff" : "#f8fafc",
          borderRadius: 16,
          border: `1.5px solid ${isListening ? "#93c5fd" : "#e2e8f0"}`,
          padding: "clamp(12px,2vw,18px)",
          minHeight: 80,
          marginBottom: 14,
          transition: "all 0.25s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={isListening ? "#3b82f6" : "#9ca3af"} />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke={isListening ? "#3b82f6" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: isListening ? "#3b82f6" : "#9ca3af", letterSpacing: "0.04em" }}>
              {isListening ? "Recording your answer..." : isSpeaking ? "Listen to the question..." : evaluating ? "Evaluating..." : "Waiting..."}
            </span>

            {/* Waveform */}
            {isListening && (
              <div style={{ display: "flex", gap: 3, marginLeft: "auto", alignItems: "flex-end", height: 18 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{
                    width: 3, borderRadius: 2, background: "#3b82f6",
                    animation: `bar${i} 0.6s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
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

            {/* Countdown pill */}
            {isListening && silenceCountdown !== null && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: urgent ? "#fee2e2" : "#f0fdf4",
                color: urgent ? "#b91c1c" : "#059669",
                border: `1px solid ${urgent ? "#fca5a5" : "#6ee7b7"}`,
                padding: "3px 10px", borderRadius: 20,
                transition: "all 0.3s",
                marginLeft: 4,
              }}>
                {silenceCountdown}s left
              </span>
            )}
          </div>

          <p style={{
            fontSize: 14, lineHeight: 1.65,
            color: transcript ? "#1f2937" : "#9ca3af",
            margin: 0,
            fontStyle: transcript ? "normal" : "italic",
          }}>
            {transcript || "Your answer will appear here as you speak..."}
          </p>
        </div>

        {/* Manual submit */}
        {isListening && (
          <button
            onClick={handleManualSubmit}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: "1.5px solid #10b981",
              background: "#f0fdf4",
              color: "#065f46",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 16,
              transition: "all 0.2s",
              fontFamily: "inherit",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#d1fae5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
          >
            ✓ Submit Answer & Next Question
          </button>
        )}

        {/* Hint text */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
          {isListening
            ? `Speak your answer · Auto-submits after ${SILENCE_TIMEOUT_MS / 1000}s of silence`
            : isSpeaking
            ? "Listen carefully — microphone starts automatically after"
            : evaluating
            ? "Generating your feedback report..."
            : ""}
        </p>

        {/* Evaluating spinner */}
        {evaluating && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>
            <div style={{
              width: 22, height: 22,
              border: "2.5px solid #d1fae5", borderTopColor: "#10b981",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ color: "#059669", fontSize: 14, fontWeight: 600 }}>Generating your report...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}