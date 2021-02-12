const axios = require("axios");

const getImage = async (url) => {
  return await axios
    .request({
      method: "GET",
      url,
      responseType: "arraybuffer",
      responseEncoding: "binary",
    })
    .then(({ data }) => Buffer.from(data));
};

exports.getImage = getImage;
