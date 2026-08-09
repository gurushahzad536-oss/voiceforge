// Shown in the clone/generate language pickers. F5-TTS's base checkpoint is
// strongest in English and Mandarin — other languages are listed because the
// UI/API support them, but output quality will vary until a multilingual or
// language-specific checkpoint is swapped in on the backend. See README.
export const LANGUAGES = [
  "English",
  "Mandarin Chinese",
  "Urdu",
  "Hindi",
  "Arabic",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Italian",
  "Turkish",
  "Bengali",
  "Indonesian",
  "Vietnamese",
  "Auto-detect",
] as const;
