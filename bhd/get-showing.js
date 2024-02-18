const axios = require("axios");
const cheerio = require("cheerio");

let config = {
  method: "get",
  url: "https://www.bhdstar.vn/",
};
async function getBhdShowingMovies() {
  let showingMoviesReturn = [];

  await axios
    .request(config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      let lists = $(
        ".container-search-header.container-search-header-now ul li a"
      );
      for (const list of lists) {
        let id = $(list).attr("data-id");
        showingMoviesReturn.push(id);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return showingMoviesReturn;
}

module.exports = getBhdShowingMovies;

getBhdShowingMovies().then((res) => {
  console.log(res);
});
