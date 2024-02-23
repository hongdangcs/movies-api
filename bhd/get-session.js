const axios = require("axios");
const cheerio = require("cheerio");

async function getSession(movieId) {
  let id = movieId.split("_")[1];
  let session = "";
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://www.bhdstar.vn/dat-ve/?f=" + id + "#/",
  };
  try {
    console.log(config.url);
    await axios
      .request(config)
      .then((response) => {
        const $ = cheerio.load(response.data);
        session = $("#ldapp-vue-inline-js-js-extra").first().text();
        session = session.split(":")[session.split(":").length - 1];
        session = session.split('"')[1];
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
  return session;
}

module.exports = getSession;
