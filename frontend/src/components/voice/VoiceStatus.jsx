import { DEFAULT_LANGUAGE, getVoiceLabels } from "./voiceLabels";
import "./VoiceStatus.css";

const KNOWN_STATUSES = ["idle", "listening", "processing", "success", "error"];

// Icons are decoration. The text next to them carries the meaning.
const ICONS = {
  idle: "🎤",
  listening: "👂",
  processing: "⏳",
  success: "✓",
  error: "⚠",
};

// Props:
//   status   - 'idle' | 'listening' | 'processing' | 'success' | 'error'
//              Anything else is treated as 'idle'.
//   message  - optional extra text (for example, a detail from the voice service)
//   lang     - 'am' | 'om' | 'en' (default 'am')
// This component does not touch the microphone or call Voxide.
// The parent decides the status and passes it in.
function VoiceStatus({
  status = "idle",
  message = "",
  lang = DEFAULT_LANGUAGE,
}) {
  const t = getVoiceLabels(lang);
  const current = KNOWN_STATUSES.includes(status) ? status : "idle";

  return (
    // aria-live makes screen readers announce the text when it changes.
    <div
      className={`voice-status voice-status--${current}`}
      role="status"
      aria-live="polite"
      lang={lang}
    >
      <span className="voice-status__icon" aria-hidden="true">
        {ICONS[current]}
      </span>
      <div className="voice-status__text">
        <span className="voice-status__label">{t[current]}</span>
        {message ? (
          <span className="voice-status__message">{message}</span>
        ) : null}
      </div>
    </div>
  );
}

export default VoiceStatus;
