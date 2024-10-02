/*
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
*/
const axios = require("axios");
const cheerio = require("cheerio");
let config = {
  method: "get",
  url: "https://bhdstar.vn/lich-chieu/",
};
async function getBhdShowingMovies() {
  let showingMoviesReturn = [];
  await axios
    .request(config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      let lists = $(".row.large-columns-5.medium-columns-3.small-columns-2");
      let comming = lists[0];
      let showingMovies = $(comming).find(".col.film-col-item");
      showingMovies.each((index, element) => {
        let movie = $(element);
        let movieId = movie.find("a").attr("data-id");
        let movieSlug = movie.find("a").attr("data-url");
        if (movieId == undefined) {
          return;
        }
        movieSlug = movieSlug.split("/")[4].split("/")[0];
        showingMoviesReturn.push(movieId + "_" + movieSlug);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  return showingMoviesReturn;
}

module.exports = getBhdShowingMovies;
