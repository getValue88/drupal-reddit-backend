// IMPORTS
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
require("dotenv").config({ path: "../.env" });
const { getPost } = require("./getPosts");
const { submitArticle } = require("./submitArticle");
const { postImage } = require("./postImage");
const { defaultImages } = require("./defaultImages");

// CONFIG
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.options("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  res.header("Content-Type", "application/vnd.api+json");
  req.header("Content-Type", "application/vnd.api+json");

  res.send(200);
});

const port = process.env.PORT || 3001;
// Endpoints ----------------------------------------------------------------------

app.get("/", [getPost], async (req, res) => {
  try {
    const { article } = req.body;

    if (article.img) {
      const uploadedImgId = await postImage(article.img, article.imgName);
      article.img = uploadedImgId;
    } else {
      article.img = defaultImages[article.sub];
    }

    const response = await submitArticle(article);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

// Initialize server -------------------------------------------------------------

app.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});

// Awake dyno --------------------------------------------------------------------
const timer = port === 3001 ? 0.5 : 6;

const awakeDyno = () => {
  setInterval(() => {
    console.log("Dyno awaking :O");
    const options = {
      host: "localhost",
      port: port,
      path: "/",
    };
    http
      .get(options, (res) => {
        res.on("data", (chunk) => {
          try {
          } catch (err) {
            console.log(err.message);
          }
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  }, timer * 60 * 1000);
};

awakeDyno();
