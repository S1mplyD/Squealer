import axios from "axios";
import squealModel from "../database/models/squeals.model";

const time = 1000 * 60 * 60;

const getRandomArticle = async () => {
  const response = await axios.get(
    "https://en.wikipedia.org/api/rest_v1/page/random/summary",
  );
  return response.data;
};

export const postRandomArticle = async () => {
  setInterval(async () => {
    const article = await getRandomArticle();
    console.log(article.extract);
    await squealModel.create({
      body: article.extract,
      date: Date.now(),
      author: "Squealer",
      category: "public",
      channels: ["§RANDOM_FACT"],
      type: "text",
      originalSqueal: "",
    });
  }, time);
};
