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
  const [textInput, setTextInput] = useState("");
  const [inputMode, setInputMode] = useState("voice");
  const [silenceCountdown, setSilenceCountdown] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const isProcessing = useRef(false);
  const indexRef = useRef(0);
  const responsesRef = useRef([]);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const intentionalLeave = useRef(false);
  const textareaRef = useRef(null);
  const inputModeRef = useRef("voice");
  const handleAnswerRef = useRef(null);
  const speakQuestionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => { indexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { inputModeRef.current = inputMode; }, [inputMode]);

  useEffect(() => {
    const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      if (intentionalLeave.current) return;
      window.history.pushState(null, "", window.location.href);
      setShowLeaveModal(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const confirmLeave = () => {
    window.speechSynthesis.cancel();
    clearTimeout(silenceTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} }
    intentionalLeave.current = true;
    setShowLeaveModal(false);
    setStep("setup");
  };

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
    const trimmed = answerText.trim() || "(No answer provided)";
    const newEntry = { question: questions[idx], student_answer: trimmed };
    const updated = [...responsesRef.current, newEntry];
    responsesRef.current = updated;
    setResponses(updated);
    setTranscript("");
    setTextInput("");
    setInputMode("voice");
    inputModeRef.current = "voice";
    stopCountdown();
    setIsTransitioning(true);
    if (idx + 1 < questions.length) {
      const next = idx + 1;
      indexRef.current = next;
      setCurrentIndex(next);
    } else {
      submitInterview(updated);
    }
  }, [questions, setResponses, submitInterview]);
  handleAnswerRef.current = handleAnswer;

  const handleVoiceSubmit = () => {
    clearTimeout(silenceTimerRef.current);
    stopCountdown();
    if (recognitionRef.current) {
      try { recognitionRef.current._manualAbort?.(); } catch (_) {}
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    setIsListening(false);
    isProcessing.current = false;
    handleAnswer(transcriptRef.current);
    transcriptRef.current = "";
  };

  const handleTextSubmit = () => {
    const val = textInput.trim();
    if (!val) return;
    window.speechSynthesis.cancel();
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} }
    clearTimeout(silenceTimerRef.current);
    stopCountdown();
    setIsListening(false);
    isProcessing.current = false;
    handleAnswer(val);
  };

  const switchToText = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current._manualAbort?.(); } catch (_) {}
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    clearTimeout(silenceTimerRef.current);
    stopCountdown();
    setIsListening(false);
    isProcessing.current = false;
    if (transcriptRef.current) setTextInput(transcriptRef.current);
    setTranscript("");
    setInputMode("text");
    inputModeRef.current = "text";
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const switchToVoice = () => {
    setInputMode("voice");
    inputModeRef.current = "voice";
    if (!isSpeaking && !isListening && !evaluating) {
      isProcessing.current = false;
      startListening();
    }
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
    let manuallyAborted = false;

    recognitionRef.current._manualAbort = () => { manuallyAborted = true; };

    const finish = () => {
      if (hasEnded || manuallyAborted) return;
      hasEnded = true;
      setIsListening(false);
      stopCountdown();
      clearTimeout(silenceTimerRef.current);
      isProcessing.current = false;
      handleAnswerRef.current(finalTranscript);
    };

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
      const combined = (finalTranscript + interim).trim();
      transcriptRef.current = combined;
      setTranscript(combined);
      clearTimeout(silenceTimerRef.current);
      resetCountdown();
      silenceTimerRef.current = setTimeout(() => {
        try { recognition.stop(); } catch (_) {}
      }, SILENCE_TIMEOUT_MS);
    };

    recognition.onend = () => finish();

    recognition.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted") {
        console.error("Speech recognition error:", e.error);
      }
      finish();
    };

    recognition.start();
    silenceTimerRef.current = setTimeout(() => {
      try { recognition.stop(); } catch (_) {}
    }, SILENCE_TIMEOUT_MS);
  }, []);

  const speakQuestion = useCallback((text) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.92;
    speech.pitch = 1;
    speech.onstart = () => { setIsSpeaking(true); setIsTransitioning(false); };
    speech.onend = () => {
      setIsSpeaking(false);
      if (inputModeRef.current === "voice") startListening();
      else isProcessing.current = false;
    };
    speech.onerror = () => { setIsSpeaking(false); isProcessing.current = false; };
    window.speechSynthesis.speak(speech);
  }, [startListening]);
  speakQuestionRef.current = speakQuestion;

  useEffect(() => {
    if (!questions.length) return;
    isProcessing.current = false;
    setTextInput("");
    setTranscript("");
    transcriptRef.current = "";
    setInputMode("voice");
    inputModeRef.current = "voice";
    const q = questions[currentIndex];
    if (!q) return;
    const timer = setTimeout(() => {
      speakQuestionRef.current(`Question ${currentIndex + 1}. ${q}`);
    }, 150);
    return () => {
      clearTimeout(timer);
      clearTimeout(silenceTimerRef.current);
      clearInterval(countdownIntervalRef.current);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} }
      isProcessing.current = false;
    };
  }, [currentIndex, questions]);

  const progress = (currentIndex / questions.length) * 100;
  const urgent = silenceCountdown !== null && silenceCountdown <= 3;
  const canSubmitText = textInput.trim().length > 0;

  return (
    <>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        border: "0.5px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
        width: "100%",
      }}>

        {/* Progress header */}
        <div style={{
          background: "#fafafa",
          borderBottom: "0.5px solid #e5e7eb",
          padding: "13px clamp(16px,4vw,28px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 500, color: "#6b7280",
              background: "#fff", padding: "3px 12px", borderRadius: 99,
              border: "0.5px solid #e5e7eb",
            }}>
              {role}
            </span>
          </div>
          <div style={{ height: 4, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              background: "#16a34a",
              width: `${progress}%`,
              borderRadius: 99,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        <div style={{ padding: "clamp(20px,5vw,36px) clamp(16px,4vw,36px)" }}>

          {/* Robot + question bubble */}
          <div style={{
            display: "flex",
            gap: "clamp(16px,3vw,28px)",
            alignItems: "center",
            marginBottom: 22,
            flexWrap: "wrap",
          }}>
            <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", width: "100%" }}>
              <div style={{ maxWidth: 180 }}>
                <RobotAvatar isSpeaking={isSpeaking} isListening={isListening} />
              </div>
            </div>

            <div style={{
              flex: 1, minWidth: 0,
              background: "#fafafa",
              borderRadius: 14,
              border: "0.5px solid #e5e7eb",
              padding: "clamp(14px,3vw,20px) clamp(14px,3vw,22px)",
              width: "100%",
            }}>
              <p style={{
                fontSize: 11, fontWeight: 500, color: "#9ca3af",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
              }}>
                Question {currentIndex + 1}
              </p>
              <p style={{
                fontSize: "clamp(14px,2vw,16px)",
                fontWeight: 500, color: "#111827",
                lineHeight: 1.65, margin: 0,
              }}>
                {questions[currentIndex]}
              </p>
            </div>
          </div>

          {/* Input Mode Toggle */}
          {!isSpeaking && !evaluating && !isTransitioning && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "#f4f4f4",
              borderRadius: 10,
              padding: 3,
              marginBottom: 14,
              border: "0.5px solid #e5e7eb",
            }}>
              {[
                { mode: "voice", label: "Voice" },
                { mode: "text",  label: "Text" },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => mode === "text" ? switchToText() : switchToVoice()}
                  style={{
                    padding: "9px 0",
                    borderRadius: 8,
                    border: inputMode === mode ? "0.5px solid #e5e7eb" : "none",
                    background: inputMode === mode ? "#fff" : "transparent",
                    color: inputMode === mode ? "#111827" : "#9ca3af",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {mode === "voice" ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* VOICE MODE UI */}
          {inputMode === "voice" && !isTransitioning && (
            <>
              <div style={{
                background: isListening ? "#eff6ff" : "#fafafa",
                borderRadius: 12,
                border: `0.5px solid ${isListening ? "#bfdbfe" : "#e5e7eb"}`,
                padding: "clamp(12px,2vw,16px)",
                minHeight: 80,
                marginBottom: 12,
                transition: "all 0.2s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={isListening ? "#3b82f6" : "#d1d5db"} />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke={isListening ? "#3b82f6" : "#d1d5db"} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 500, color: isListening ? "#3b82f6" : "#9ca3af", letterSpacing: "0.04em" }}>
                    {isListening ? "Recording your answer..." : isSpeaking ? "Listen to the question..." : evaluating ? "Evaluating..." : "Waiting..."}
                  </span>

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

                  {isListening && silenceCountdown !== null && (
                    <span style={{
                      fontSize: 11, fontWeight: 500,
                      background: urgent ? "#fff1f2" : "#f0fdf4",
                      color: urgent ? "#dc2626" : "#16a34a",
                      border: `0.5px solid ${urgent ? "#fecaca" : "#bbf7d0"}`,
                      padding: "2px 9px", borderRadius: 99,
                      transition: "all 0.3s",
                      marginLeft: 4,
                    }}>
                      {silenceCountdown}s left
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize: 14, lineHeight: 1.65,
                  color: transcript ? "#111827" : "#9ca3af",
                  margin: 0,
                  fontStyle: transcript ? "normal" : "italic",
                }}>
                  {transcript || "Your answer will appear here as you speak..."}
                </p>
              </div>

              {isListening && (
                <button
                  onClick={handleVoiceSubmit}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    border: "0.5px solid #bbf7d0",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    marginBottom: 14,
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#dcfce7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Submit answer & next question
                </button>
              )}

              <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
                {isListening
                  ? `Speak your answer · Auto-submits after ${SILENCE_TIMEOUT_MS / 1000}s of silence`
                  : isSpeaking
                  ? "Listen carefully — microphone starts automatically after"
                  : evaluating
                  ? "Generating your feedback report..."
                  : ""}
              </p>
            </>
          )}

          {/* TEXT MODE UI */}
          {inputMode === "text" && !isSpeaking && !evaluating && !isTransitioning && (
            <div>
              <div style={{ position: "relative" }}>
                <textarea
                  ref={textareaRef}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmitText) {
                      e.preventDefault();
                      handleTextSubmit();
                    }
                  }}
                  placeholder="Type your answer here..."
                  rows={5}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `0.5px solid ${textInput ? "#bfdbfe" : "#e5e7eb"}`,
                    background: "#fafafa",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#111827",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s ease",
                    marginBottom: 10,
                    display: "block",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#bfdbfe")}
                  onBlur={(e) => (e.target.style.borderColor = textInput ? "#bfdbfe" : "#e5e7eb")}
                />
                {textInput.length > 0 && (
                  <span style={{
                    position: "absolute",
                    bottom: 20,
                    right: 14,
                    fontSize: 11,
                    color: "#9ca3af",
                    fontWeight: 500,
                    pointerEvents: "none",
                  }}>
                    {textInput.length} chars
                  </span>
                )}
              </div>

              <button
                onClick={handleTextSubmit}
                disabled={!canSubmitText}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 10,
                  border: canSubmitText ? "0.5px solid #bfdbfe" : "0.5px solid #e5e7eb",
                  background: canSubmitText ? "#eff6ff" : "#f9fafb",
                  color: canSubmitText ? "#2563eb" : "#9ca3af",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: canSubmitText ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => { if (canSubmitText) e.currentTarget.style.background = "#dbeafe"; }}
                onMouseLeave={(e) => { if (canSubmitText) e.currentTarget.style.background = "#eff6ff"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Submit answer
              </button>

              <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", margin: "8px 0 0", lineHeight: 1.6 }}>
                Press{" "}
                <kbd style={{ background: "#f4f4f4", border: "0.5px solid #e5e7eb", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "inherit" }}>
                  Ctrl+Enter
                </kbd>{" "}
                to submit
              </p>
            </div>
          )}

          {/* Evaluating spinner */}
          {evaluating && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 24 }}>
              <div style={{
                width: 20, height: 20,
                border: "2px solid #e5e7eb", borderTopColor: "#16a34a",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              <span style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>Generating your report...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "0.5px solid #e5e7eb",
            padding: "clamp(24px,4vw,32px)",
            maxWidth: 400, width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "#fff1f2",
              border: "0.5px solid #fecaca",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Leave interview?</h2>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>
              Your progress will be lost and the interview won't be completed. Are you sure you want to leave?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowLeaveModal(false)}
                style={{
                  flex: 1, padding: "11px", borderRadius: 10,
                  border: "0.5px solid #e5e7eb", background: "#fff", color: "#374151",
                  fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
              >
                Continue interview
              </button>
              <button
                onClick={confirmLeave}
                style={{
                  flex: 1, padding: "11px", borderRadius: 10,
                  border: "0.5px solid #fecaca", background: "#fff1f2", color: "#dc2626",
                  fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fecaca"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff1f2"; }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}