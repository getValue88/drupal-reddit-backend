const axios = require("axios");
const fs = require("fs");
require("dotenv").config({ path: "./.env" });
const { categories } = require("./categories");

const auth = process.env.AUTH;
const drupalUrl = process.env.URL;

const headers = {
  headers: {
    Authorization: `Basic ${auth}`,
  },
};

const submitArticle = async (article) => {
  console.log("Submitting article\n");
  axios.defaults.headers["Content-Type"] = "application/vnd.api+json";
  axios.defaults.headers["Accept"] = "application/vnd.api+json";
  console.log(article);
  console.log(categories[article.sub]);
  const body = {
    data: {
      type: "node--article",
      attributes: {
        title: article.title,
        field_link: article.link,
        field_score: article.score,
      },
      relationships: {
        field_category: {
          data: {
            type: "taxonomy_term--articles",
            id: categories[article.sub].term,
          },
        },
        // field_tags: {
        //   data: {
        //     type: "",
        //     id: categories[article.sub].tags,
        //   },
        // },
      },
    },
  };

  if (article.img) {
    body.data.relationships.field_image = {
      data: {
        type: "file--file",
        id: article.img,
      },
    };
  }

  axios
    .post(drupalUrl + "/jsonapi/node/article", body, headers)
    .then(() => {
      fs.appendFileSync("./src/uploadedContent.txt", article.title.replace(/,/g, " ") + ",");
      console.log(`Article uploaded succesfully! ${article.title}\n`);
      return article;
    })
    .catch((e) => {
      console.log("Failed to post article :(\n");
      console.log("Status: " + e.response.status);
      console.log(e.response.data);
      console.log("\n");
    });
};

exports.submitArticle = submitArticle;
