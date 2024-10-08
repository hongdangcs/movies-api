/*
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
*/

const axios = require("axios");
const cheerio = require("cheerio");
let config = {
  method: "get",
  url: "https://bhdstar.vn/lich-chieu/",
};
async function getBhdCommingMovies() {
  let commingMoviesReturn = [];
  await axios
    .request(config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      
      
      let lists = $(".col.small-12.large-12 .col-inner .film-slider");
      let comming = lists[lists.length - 1];
      let commingMovies = $(comming).find(".col.film-col-item");      
      commingMovies.each((index, element) => {
        let movie = $(element);
        
        let movieId = movie.find("a").attr("data-id");
        if (movieId == undefined) {
          return;
        }
        let movieSlug = movie.find("a").attr("data-url");
        movieSlug = movieSlug.split("/")[4].split("/")[0];
        commingMoviesReturn.push(movieId + "_" + movieSlug);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  return commingMoviesReturn;
}
module.exports = getBhdCommingMovies;
