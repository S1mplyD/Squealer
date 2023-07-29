const imagetypes: Array<string> = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const videotypes: Array<string> = ["mp4", "webm", "ogv", "ogg"];
const plans: Array<string> = [
  "base",
  "verfied",
  "professional",
  "journalist",
  "admin",
];

const defaultCharactersBase = [300, 2000, 7500];
const defaultCharactersVerified = [600, 4000, 15000];
const defaultCharactersProfessional = [1000, 6500, 25000];
const defaultCharactersJournalist = [3000, 20000, 75000];

export {
  imagetypes,
  videotypes,
  plans,
  defaultCharactersBase,
  defaultCharactersJournalist,
  defaultCharactersProfessional,
  defaultCharactersVerified,
};
