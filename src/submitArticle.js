const axios = require("axios");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });

const auth = process.env.AUTH;
const drupalUrl = process.env.URL;

const headers = {
  headers: {
    Authorization: `Basic ${auth}`,
  },
};

const submitArticle = async (article) => {
  console.log("Submitting article");
  axios.defaults.headers["Content-Type"] = "application/vnd.api+json";
  axios.defaults.headers["Accept"] = "application/vnd.api+json";

  const body = {
    data: {
      type: "node--article",
      attributes: {
        title: article.title,
        body: {
          value: `Subreddit: ${article.sub} Link: ${article.link}`,
          format: "plain_text",
        },
      },
    },
  };

  if (article.img) {
    body.data.relationships = {
      field_image: {
        data: {
          type: "file--file",
          id: article.img,
        },
      },
    };
  }


axios
  .post(drupalUrl + "/jsonapi/node/article", body, headers)
  .then(() => {
    fs.appendFileSync("uploadedContent.txt", article.title.replace(/,/g, " ") + ",");
    console.log(`Article uploaded succesfully! ${article.title}`);
    return article;
  })
  .catch((e) => {
    console.log(e);
    console.log("Failed to post article :(");
  });
};

exports.submitArticle = submitArticle;