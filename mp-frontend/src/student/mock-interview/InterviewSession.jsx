import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Mic, Type, CheckCircle2, Send, AlertTriangle } from "lucide-react";
import RobotAvatar from "./RobotAvatar";
import { evaluateInterview } from "../../services/mockInterviewService";

const SILENCE_TIMEOUT_MS = 12000;

export default function InterviewSession({
  role, questions, setResponses, setFeedback, setStep,
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
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch { /* best-effort, ignore */ } }
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
    } catch {
      toast.error("Evaluation failed. Please try again.");
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
      try { recognitionRef.current._manualAbort?.(); } catch { /* best-effort, ignore */ }
      try { recognitionRef.current.abort(); } catch { /* best-effort, ignore */ }
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
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch { /* best-effort, ignore */ } }
    clearTimeout(silenceTimerRef.current);
    stopCountdown();
    setIsListening(false);
    isProcessing.current = false;
    handleAnswer(val);
  };

  const switchToText = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current._manualAbort?.(); } catch { /* best-effort, ignore */ }
      try { recognitionRef.current.abort(); } catch { /* best-effort, ignore */ }
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
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch { /* best-effort, ignore */ } }

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
        try { recognition.stop(); } catch { /* best-effort, ignore */ }
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
      try { recognition.stop(); } catch { /* best-effort, ignore */ }
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
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch { /* best-effort, ignore */ } }
      isProcessing.current = false;
    };
  }, [currentIndex, questions]);

  const progress = (currentIndex / questions.length) * 100;
  const urgent = silenceCountdown !== null && silenceCountdown <= 3;
  const canSubmitText = textInput.trim().length > 0;

  return (
    <>
      <div className="bg-white rounded-2xl border border-mist shadow-card overflow-hidden w-full">

        {/* Progress header */}
        <div className="bg-paper/60 border-b border-mist px-4 sm:px-7 py-3.5">
          <div className="flex justify-between items-center mb-2.5 gap-3 flex-wrap">
            <span className="text-[13px] font-medium text-ink/70">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs font-medium text-ink/50 bg-white px-3 py-1 rounded-full border border-mist">
              {role}
            </span>
          </div>
          <div className="h-1 bg-mist rounded-full overflow-hidden">
            <div
              className="h-full bg-pine rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-4 sm:px-9 py-5 sm:py-9">

          {/* Robot + question bubble */}
          <div className="flex gap-4 sm:gap-7 items-center mb-5.5 flex-wrap">
            <div className="shrink-0 flex justify-center w-full">
              <div className="max-w-[180px]">
                <RobotAvatar isSpeaking={isSpeaking} isListening={isListening} />
              </div>
            </div>

            <div className="flex-1 min-w-0 bg-paper/60 rounded-2xl border border-mist px-4 sm:px-5.5 py-3.5 sm:py-5 w-full">
              <p className="text-[11px] font-medium text-ink/40 uppercase tracking-wider mb-2">
                Question {currentIndex + 1}
              </p>
              <p className="text-sm sm:text-base font-medium text-ink leading-relaxed">
                {questions[currentIndex]}
              </p>
            </div>
          </div>

          {/* Input Mode Toggle */}
          {!isSpeaking && !evaluating && !isTransitioning && (
            <div className="grid grid-cols-2 bg-ink/5 rounded-xl p-0.5 mb-3.5 border border-mist">
              {[
                { mode: "voice", label: "Voice", Icon: Mic },
                { mode: "text",  label: "Text",  Icon: Type },
              ].map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  onClick={() => mode === "text" ? switchToText() : switchToVoice()}
                  className={`py-2.5 rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5
                    ${inputMode === mode
                      ? "bg-white text-ink border border-mist"
                      : "text-ink/40 border border-transparent hover:text-ink/60"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* VOICE MODE UI */}
          {inputMode === "voice" && !isTransitioning && (
            <>
              <div
                className={`rounded-xl border px-3.5 sm:px-4 py-3.5 sm:py-4 min-h-[80px] mb-3 transition-colors duration-200
                  ${isListening ? "bg-blue-50 border-blue-200" : "bg-paper/60 border-mist"}`}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Mic className={`w-3.5 h-3.5 shrink-0 ${isListening ? "text-blue-500" : "text-ink/30"}`} />
                  <span className={`text-xs font-medium tracking-wide ${isListening ? "text-blue-600" : "text-ink/40"}`}>
                    {isListening ? "Recording your answer…" : isSpeaking ? "Listen to the question…" : evaluating ? "Evaluating…" : "Waiting…"}
                  </span>

                  {isListening && (
                    <div className="flex gap-0.5 ml-auto items-end h-4.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-0.5 rounded-sm bg-blue-500"
                          style={{
                            animation: `bar${i} 0.6s ease-in-out infinite`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
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
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ml-1 transition-colors duration-300
                        ${urgent ? "bg-red-50 text-red-600 border-red-200" : "bg-pine/8 text-pine border-pine/20"}`}
                    >
                      {silenceCountdown}s left
                    </span>
                  )}
                </div>

                <p className={`text-sm leading-relaxed ${transcript ? "text-ink not-italic" : "text-ink/40 italic"}`}>
                  {transcript || "Your answer will appear here as you speak…"}
                </p>
              </div>

              {isListening && (
                <button
                  onClick={handleVoiceSubmit}
                  className="w-full py-3 rounded-xl border border-pine/25 bg-pine/8 hover:bg-pine/15 text-pine text-sm font-medium mb-3.5 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submit answer & next question
                </button>
              )}

              <p className="text-center text-xs text-ink/40 leading-relaxed">
                {isListening
                  ? `Speak your answer · Auto-submits after ${SILENCE_TIMEOUT_MS / 1000}s of silence`
                  : isSpeaking
                  ? "Listen carefully — microphone starts automatically after"
                  : evaluating
                  ? "Generating your feedback report…"
                  : ""}
              </p>
            </>
          )}

          {/* TEXT MODE UI */}
          {inputMode === "text" && !isSpeaking && !evaluating && !isTransitioning && (
            <div>
              <div className="relative">
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
                  className={`w-full box-border px-4 py-3.5 rounded-xl border bg-paper/60 text-sm leading-relaxed text-ink resize-y outline-none transition-colors mb-2.5 block
                    ${textInput ? "border-blue-200 focus:border-blue-300" : "border-mist focus:border-ink/20"}`}
                />
                {textInput.length > 0 && (
                  <span className="absolute bottom-5 right-3.5 text-[11px] text-ink/40 font-medium pointer-events-none">
                    {textInput.length} chars
                  </span>
                )}
              </div>

              <button
                onClick={handleTextSubmit}
                disabled={!canSubmitText}
                className={`w-full py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2
                  ${canSubmitText
                    ? "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer"
                    : "border-mist bg-paper/60 text-ink/35 cursor-not-allowed"
                  }`}
              >
                <Send className="w-3.5 h-3.5" />
                Submit answer
              </button>

              <p className="text-center text-[11px] text-ink/40 leading-relaxed mt-2">
                Press{" "}
                <kbd className="bg-ink/5 border border-mist rounded px-1.5 py-0.5 text-[10px]">
                  Ctrl+Enter
                </kbd>{" "}
                to submit
              </p>
            </div>
          )}

          {/* Evaluating spinner */}
          {evaluating && (
            <div className="flex items-center justify-center gap-2.5 mt-6">
              <div className="w-5 h-5 rounded-full border-2 border-mist border-t-pine animate-spin" />
              <span className="text-ink/70 text-sm font-medium">Generating your report…</span>
            </div>
          )}
        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[1000] bg-ink/35 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-mist p-6 sm:p-8 max-w-[400px] w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3.5">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-display text-lg font-bold text-ink mb-1.5">Leave interview?</h2>
            <p className="text-ink/55 text-sm leading-relaxed mb-5.5">
              Your progress will be lost and the interview won't be completed. Are you sure you want to leave?
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-mist bg-white text-ink/70 text-sm font-medium hover:bg-ink/5 transition-colors"
              >
                Continue interview
              </button>
              <button
                onClick={confirmLeave}
                className="flex-1 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors"
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