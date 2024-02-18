const axios = require("axios");
const cheerio = require("cheerio");

let config = {
  method: "get",
  url: "https://www.bhdstar.vn/",
};
async function getBhdCommingMovies() {
  let commingMoviesReturn = [];

  await axios
    .request(config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      let lists = $(
        ".container-search-header.container-search-header-soon ul li a"
      );
      for (const list of lists) {
        let id = $(list).attr("data-id");
        commingMoviesReturn.push(id);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return commingMoviesReturn;
}

module.exports = getBhdCommingMovies;
