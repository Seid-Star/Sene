// All text for VoiceButton lives here.
// NOTE: Amharic (am) and Afaan Oromoo (om) texts must be reviewed by a native speaker.

export const DEFAULT_LANGUAGE = "am";

export const VOICE_BUTTON_LABELS = {
  am: {
    start: "ለመናገር ይንኩ",
    stop: "ለማቆም ይንኩ",
    processing: "በማስኬድ ላይ…",
  },
  om: {
    start: "Dubbachuuf tuqi",
    stop: "Dhaabuuf tuqi",
    processing: "Hojjechaa jira…",
  },
  en: {
    start: "Tap to speak",
    stop: "Tap to stop",
    processing: "Processing…",
  },
};

// Unknown language codes fall back to English instead of crashing.
export const getVoiceButtonLabels = (lang) =>
  VOICE_BUTTON_LABELS[lang] ?? VOICE_BUTTON_LABELS.en;
