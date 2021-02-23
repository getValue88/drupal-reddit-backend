const Reddit = require("@cxllm/reddit");
const axios = require("axios");
const fs = require("fs");
const subs = require("./subreddits");
const { getImage } = require("./getImage");

const getPost = async (req, res, next) => {
  console.log("Looking for a new post");
  try {
    const random = Math.round(Math.random() * (subs.length - 1));
    const sub = subs[random];
    const url = await Reddit.top(sub).then((data) => data.url + ".json");
    const post = await axios.get(url).then(({ data }) => {
      data = data[0].data.children[0].data;
      if (!data.url.includes("redd")) {
        const alreadyUploaded = fs.readFileSync("./src/uploadedContent.txt", "utf-8").split(",");

        if (!alreadyUploaded.includes(data.title.replace(/,/g, " "))) {
          return data;
        } else console.log("Duplicated Article\n");
      }
      return null;
    });

    if (!post) return getPost(req, res, next);

    const article = {
      sub: post.subreddit,
      title: post.title,
      img: post.thumbnail ? post.thumbnail : null,
      link: post.url,
      score: post.score,
    };

    if (article.img) {
      const binaryImg = await getImage(article.img);
      const imgUrlSplit = article.img.split("/");
      article.imgName = article.sub + "_" + imgUrlSplit[imgUrlSplit.length - 1];

      article.img = binaryImg;
    }

    req.body.article = article;
    console.log(`Article found! ${article.title}`);
    next();
  } catch (e) {
    getPost(req, res, next);
  }
};

exports.getPost = getPost;
