// All text for the voice components lives here.
// NOTE: Amharic (am) and Afaan Oromoo (om) texts must be reviewed by a native speaker.

export const DEFAULT_LANGUAGE = "am";

export const VOICE_LABELS = {
  am: {
    statusLabel: "የድምፅ ሁኔታ",
    idle: "ለመናገር ዝግጁ",
    listening: "እየሰማሁ ነው…",
    processing: "በማስኬድ ላይ…",
    success: "ተሳክቷል",
    error: "አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
  },
  om: {
    statusLabel: "Haala sagalee",
    idle: "Dubbachuuf qophaa’aadha",
    listening: "Dhaggeeffachaa jira…",
    processing: "Hojjechaa jira…",
    success: "Milkaa’eera",
    error: "Hin milkoofne. Mee irra deebi’ii yaali.",
  },
  en: {
    statusLabel: "Voice status",
    idle: "Ready to listen",
    listening: "Listening…",
    processing: "Processing…",
    success: "Done",
    error: "Something went wrong. Please try again.",
  },
};

// Unknown language codes fall back to English instead of crashing.
export const getVoiceLabels = (lang) => VOICE_LABELS[lang] ?? VOICE_LABELS.en;
