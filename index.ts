import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import inquirer from "inquirer";
import util from "util";

const genClient = () => {
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    "/Users/fred/Downloads/dutch-tts-dd6be355172f.json";

  return new textToSpeech.TextToSpeechClient();
};

const buildSSML = ({ titel, woorden }: { titel: string; woorden: string }) => {
  const lines = woorden.trim().split("\n");

  const linesWithWords = lines
    .filter((line) => line.trim() !== "" || line.includes("-"))
    .map((line) => line.split("-").map((v) => v.trim()));

  return `<speak>Welkom naar ${titel} van de Nederlandse woordenschat.<break time="2000ms"/>
${linesWithWords
  .map(
    (words) =>
      `${words[0]}<break time="3000ms"/>${words[1]}<break time="3000ms"/>`
  )
  .join("")}

En opniew<break time="2000ms"/>
${shuffle(linesWithWords)
  .map(
    (words) =>
      `${words[0]}<break time="3000ms"/>${words[1]}<break time="3000ms"/>`
  )
  .join("")}
  
    En dat was ${titel} van de woordenschat,<break time="500ms"/> tot volgend keer.
</speak>`;
  // .replace(/\n/g, " ");
  // .replace(/"/g, `"`);
};

const main = async () => {
  process.env.EDITOR = "vim";

  const client = genClient();

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "titel",
      message: `Wat zou de titel van dit les zijn?`,
    },
    {
      type: "editor",
      message: "Vul de woorden voor dit les",
      name: "woorden",
    },
  ]);

  console.log(answers);

  const ssml = buildSSML({
    titel: answers.titel,
    woorden: answers.woorden,
  });
  console.log(`ssml`, ssml);
  const request = {
    input: {
      ssml: ssml,
    },
    voice: {
      languageCode: "nl-NL",
      name: "nl-NL-Wavenet-B",
      ssmlGender: "FEMALE",
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
  const fileName = `${answers.titel}.mp3`;
  await writeFile(fileName, response.audioContent, "binary");
  console.log(`Audio content written to file: ${fileName}`);
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
