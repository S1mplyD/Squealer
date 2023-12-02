const imagetypes: Array<string> = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const videotypes: Array<string> = ["mp4", "webm", "ogv", "ogg"];

const defaultCharactersBase = [300, 2000, 7500];
const defaultCharactersProfessional = [1000, 6500, 25000];
const defaultCharactersJournalist = [3000, 20000, 75000];
const geoCharacters = 125;
// ms * s * m * h
const updateAnalyticTime = 1000 * 60 * 60 * 24;

export {
  imagetypes,
  videotypes,
  defaultCharactersBase,
  defaultCharactersJournalist,
  defaultCharactersProfessional,
  geoCharacters,
  updateAnalyticTime,
};
