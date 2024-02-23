const axios = require("axios");
const cheerio = require("cheerio");

async function getBhdMovieDetails(movieId) {
  let movieDetails = {};

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://www.bhdstar.vn/movie/${movieId}/`,
  };

  await axios
    .request(config)
    .then((response) => {
      let $ = cheerio.load(response.data);
      let movieName = $(".product--name h3").text();
      let movieImage = $(".col-thubnail-bhd a img.movie-full")
        .attr("src")
        .split("?refer")[0];
      let descreption = $(".film--detail").text();
      let movieMetas = $(".product--view .film--info li");
      let director = "";
      let cast = "";
      let duration = "";
      let trailer = $(".product--view .bhd-trailer").attr("href") || "";
      let age = "";
      let genre = "";

      movieMetas.each((index, element) => {
        if ($(element).text().includes("Diễn viên")) {
          cast = $(element).find(".col-right").text();
        }
        if ($(element).text().includes("Thời lượng")) {
          duration = $(element).find(".col-right").text();
        }
        if ($(element).text().includes("Phân loại")) {
          age = $(element).find(".col-right").text();
        }
        if ($(element).text().includes("Thể loại")) {
          genre = $(element).find(".col-right").text();
        }
        if ($(element).text().includes("Đạo diễn")) {
          director = $(element).find(".col-right").text();
        }
      });

      movieDetails = {
        movie_id_bhd: movieId,
        movie_name: movieName,
        poster: movieImage,
        description: descreption,
        director: director,
        cast: cast,
        running_time: duration,
        trailer: trailer,
        age: age,
        genre: genre,
      };
    })
    .catch((error) => {
      console.log(error);
    });
  return movieDetails;
}

module.exports = getBhdMovieDetails;
