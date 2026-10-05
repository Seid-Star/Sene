import { useRef } from "react";
import { DEFAULT_LANGUAGE, getVoiceButtonLabels } from "./voiceButtonLabels";
import "./VoiceButton.css";

// Ignore taps that come too soon after the last one.
const TAP_DELAY_MS = 500;

// Props:
//   status   - 'idle' | 'listening' | 'processing' | 'success' | 'error'
//   onStart  - called when the user taps to start (the parent connects the voice service)
//   onStop   - called when the user taps to stop
//   disabled - optional, locks the button
//   lang     - 'am' | 'om' | 'en' (default 'am')
// This component does not touch the microphone or call Voxide.
// The parent decides the status and passes it in.
function VoiceButton({
  status = "idle",
  onStart,
  onStop,
  disabled = false,
  lang = DEFAULT_LANGUAGE,
}) {
  const t = getVoiceButtonLabels(lang);
  const lastTapRef = useRef(0);

  const isListening = status === "listening";
  const isProcessing = status === "processing";
  const isLocked = disabled || isProcessing;

  // The text changes with the state. Screen readers read the same text.
  let label = t.start;
  if (isListening) label = t.stop;
  if (isProcessing) label = t.processing;

  const handleClick = () => {
    if (isLocked) return;

    // Block fast double taps so a command is never sent twice.
    const now = Date.now();
    if (now - lastTapRef.current < TAP_DELAY_MS) return;
    lastTapRef.current = now;

    if (isListening) {
      if (onStop) onStop();
    } else if (onStart) {
      onStart();
    }
  };

  const icon = isListening ? "⏹" : isProcessing ? "⏳" : "🎤";

  return (
    <button
      type="button"
      className={`voice-button voice-button--${isListening ? "listening" : isProcessing ? "processing" : "ready"}`}
      onClick={handleClick}
      // aria-disabled keeps the button focusable, unlike the disabled attribute.
      aria-disabled={isLocked}
      aria-busy={isProcessing}
      lang={lang}
    >
      <span className="voice-button__circle" aria-hidden="true">
        {icon}
      </span>
      <span className="voice-button__label">{label}</span>
    </button>
  );
}

export default VoiceButton;
