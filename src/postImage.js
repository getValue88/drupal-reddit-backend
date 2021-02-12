const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const auth = process.env.AUTH;
const drupalUrl = process.env.URL;

const postImage = async (binaryImg, imgName) => {
  console.log("Triying to post image");
  try {
    axios.defaults.headers["Content-Type"] = "application/octet-stream";
    axios.defaults.headers["Accept"] = "application/vnd.api+json";
    const headers = {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Disposition": `file; filename="${imgName}"`,
      },
    };

    return await axios.post(drupalUrl + "/jsonapi/node/article/field_image", binaryImg, headers).then(({ data }) => {
      console.log(`Image uploaded succesfully. ID: ${data.data.id}`);
      return data.data.id;
    });
  } catch (error) {
    console.log("Failed to upload img :(");
    return null;
  }
};

exports.postImage = postImage;
