import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import inquirer from "inquirer";
import util from "util";
import {
  ABSOLUTE_PATH_TO_GOOGLE_KEY,
  LANGUAGE_CODE,
  LANGUAGE_NAME,
  LESSON_INTRO,
  LESSON_OUTRO,
  REPEAT_INTRO,
  SSML_GENDER,
  TITLE_PROMPT,
  WORDS_PROMPT,
} from "./config";

const genClient = () => {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = ABSOLUTE_PATH_TO_GOOGLE_KEY;

  return new textToSpeech.TextToSpeechClient();
};

const buildSSML = ({ title, words }: { title: string; words: string }) => {
  const lines = words.trim().split("\n");

  const linesWithWords = lines
    .filter((line) => line.trim() !== "" || line.includes("-"))
    .map((line) => line.split("-").map((v) => v.trim()));

  const introSSML = LESSON_INTRO(title);
  const learnSectionSSML = linesWithWords
    .map(
      (words) =>
        `${words[0]}<break time="3000ms"/>${words[1]}<break time="3000ms"/>`
    )
    .join("");
  const repeatSectionIntroSSML = REPEAT_INTRO();
  const repeatSectionSSML = shuffle(linesWithWords)
    .map(
      (words) =>
        `${words[0]}<break time="3000ms"/>${words[1]}<break time="3000ms"/>`
    )
    .join("");

  const lessonOutroSSML = LESSON_OUTRO(title);
  return `<speak>
  ${introSSML}
  <break time="2000ms"/>
  ${learnSectionSSML}

  ${repeatSectionIntroSSML}
  <break time="2000ms"/>
  ${repeatSectionSSML}
  
  ${lessonOutroSSML}
  </speak>`;
};

const main = async () => {
  process.env.EDITOR = "vim";

  const client = genClient();

  const answers = await inquirer.prompt<{ title: string; words: string }>([
    {
      type: "input",
      name: "title",
      message: TITLE_PROMPT,
    },
    {
      type: "editor",
      message: WORDS_PROMPT,
      name: "words",
    },
  ]);

  const ssml = buildSSML({
    title: answers.title,
    words: answers.words,
  });
  console.log(`ssml`, ssml);

  const request = {
    input: {
      ssml: ssml,
    },
    voice: {
      languageCode: LANGUAGE_CODE,
      name: LANGUAGE_NAME,
      ssmlGender: SSML_GENDER,
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  } as const;

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  if (!response.audioContent) {
    process.exit(1);
  }
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const fileName = `output/${answers.title}.mp3`;
  await writeFile(fileName, response.audioContent, "binary");
  console.log(`✅ Audio content written to file: ${fileName}`);
};

main();

function shuffle<T>(array: T[]): T[] {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
