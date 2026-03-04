import { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard";
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
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // 🤖 Speak Question
  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.pitch = 1;

    // Vibrate while speaking (mobile devices)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    speech.onend = () => {
      startListening(); // 🎤 Auto start mic
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Start Listening
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      finalTranscript += " " + transcript;

      resetSilenceTimer(finalTranscript);
    };

    recognition.onend = () => {
      handleAnswer(finalTranscript);
    };

    recognition.start();

    // Start silence timer immediately
    resetSilenceTimer(finalTranscript);
  };

  // ⏳ Silence detection
  const resetSilenceTimer = (currentAnswer) => {
    clearTimeout(silenceTimerRef.current);

    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, 5000); // 5 seconds silence → auto next
  };

  const handleAnswer = (answerText) => {
    const updated = [
      ...responses,
      {
        question: questions[currentIndex],
        student_answer: answerText.trim(),
      },
    ];

    setResponses(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitInterview(updated);
    }
  };

  const submitInterview = async (allResponses) => {
    try {
      setLoading(true);

      const speech = new SpeechSynthesisUtterance(
        "Thank you. Evaluating your performance."
      );
      window.speechSynthesis.speak(speech);

      const data = await evaluateInterview({
        role,
        responses: allResponses,
      });

      setFeedback(data);
      setStep("feedback");
    } catch (err) {
      alert("Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  // Ask question when index changes
  useEffect(() => {
    if (questions.length > 0) {
      speakQuestion(
        `Question ${currentIndex + 1}. ${questions[currentIndex]}`
      );
    }
  }, [currentIndex, questions]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
      />

      <div className="text-center mt-6">
        <p className="text-gray-500">
          🎤 Listening automatically after question...
        </p>
      </div>

      {loading && (
        <p className="text-center mt-6 text-gray-500">
          Evaluating your performance...
        </p>
      )}
    </div>
  );
}