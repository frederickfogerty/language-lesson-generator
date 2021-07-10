// Google Cloud key file that is enabled to use Google TTS service.
export const ABSOLUTE_PATH_TO_GOOGLE_KEY =
  "/Users/fred/Downloads/dutch-tts-dd6be355172f.json";

// Function to generate lesson introduction
export const LESSON_INTRO = (title: string) =>
  `Welkom naar ${title} van de Nederlandse woordenschat.`;

// Function to generate repeat (second half) intro
export const REPEAT_INTRO = () => `En opnieuw`;

export const LESSON_OUTRO = (title: string) =>
  `En dat was ${title} van de woordenschat,<break time="500ms"/> tot volgend keer.`;

// Used in the CLI to prompt for the lesson title
export const TITLE_PROMPT = `Wat zou de titel van dit les zijn?`;
// Used in the CLI to prompt for the lesson's content
export const WORDS_PROMPT = `Vul de woorden voor dit les`;

// Google TTS settings, more information can be found here: https://cloud.google.com/text-to-speech/docs/basics
export const LANGUAGE_CODE = "nl-NL";
export const LANGUAGE_NAME = "nl-NL-Wavenet-B";
export const SSML_GENDER = "FEMALE";
