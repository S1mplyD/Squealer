import axios from "axios";
import squealModel from "../database/models/squeals.model";

const time = 1000 * 60 * 60;

const getRandomNews = async () => {
  try {
    const allNewsResponse = await axios.get(
      "https://api.spaceflightnewsapi.net/v4/articles/",
    );
    const random = Math.floor(Math.random() * allNewsResponse.data.count);
    const response = await axios.get(
      `https://api.spaceflightnewsapi.net/v4/articles/${random}`,
    );
    return response.data;
  } catch (e) {
    return "not found";
  }
};

export const postRandomNews = async () => {
  setInterval(async () => {
    const article = await getRandomNews();
    console.log(article);
    if (article !== "not found")
      await squealModel.create({
        body: article.title + "\n" + article.url + "\n" + article.published_at,
        date: Date.now(),
        author: "Squealer",
        category: "public",
        channels: ["§SPACEFLIGHT_NEWS"],
        type: "text",
        originalSqueal: "",
      });
  }, time);
};
