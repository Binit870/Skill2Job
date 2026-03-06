import { useState } from "react";

export default function VoiceRecorder({ onAnswer }) {
  const [listening, setListening] = useState(false);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onAnswer(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  return (
    <div className="text-center">
      <button
        onClick={startRecording}
        className={`px-6 py-3 rounded-xl text-white ${
          listening ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {listening ? "Listening..." : "Answer with Voice"}
      </button>
    </div>
  );
}