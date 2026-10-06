import { useState, useEffect, useCallback, useRef } from "react";

export const useVoice = (onResultCallback) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API browser compatibility
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Adjust to Amharic ('am-ET') or regional locale if needed

      recognition.onstart = () => {
        setIsListening(true);
        setStatus("Listening...");
      };

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          setStatus("Processing command...");
          if (onResultCallback) {
            onResultCallback(currentTranscript);
          }
        }
      };

      recognition.onerror = (event) => {
        setStatus(`Voice error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setStatus((prev) => (prev === "Listening..." ? "" : prev));
      };

      recognitionRef.current = recognition;
    } else {
      setStatus("Speech recognition not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResultCallback]);

  // Toggle listening mode
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start error:", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    status,
    startListening,
    stopListening,
    hasSupport: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
};

export default useVoice;
