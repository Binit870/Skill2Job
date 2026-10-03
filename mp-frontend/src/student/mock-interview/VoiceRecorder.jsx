import { useState } from "react";
import toast from "react-hot-toast";
import { Mic } from "lucide-react";

export function VoiceRecorder({ onAnswer }) {
  const [listening, setListening] = useState(false);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition isn't supported in this browser");
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
    <div className="flex justify-center py-2">
      <button
        onClick={startRecording}
        className={`inline-flex items-center justify-center gap-2.5 min-w-[200px] px-7 py-3.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-200
          ${listening
            ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30"
            : "bg-gradient-to-br from-pine to-moss shadow-lg shadow-pine/30"
          }`}
      >
        <Mic className="w-4 h-4" />
        {listening ? "Listening…" : "Answer with Voice"}

        {listening && (
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
