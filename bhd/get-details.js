const axios = require("axios");
const cheerio = require("cheerio");

async function getBhdMovieDetails(movieId) {
  let movieIdSlug = movieId.split("_")[1];
  let movieDetails = {};

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://www.bhdstar.vn/phim/${movieIdSlug}/`,
  };

  await axios
    .request(config)
    .then((response) => {
      let $ = cheerio.load(response.data);
      let movieName = $("#main #content h1.title.text-uppercase").text();
      let movieImage = $("#main #content .img-inner.dark img").attr("src");
      let descreption = $("#main #content .excerpt").text();
      let movieMetas = $("#main #content .meta p");
      let director = "";
      let cast = "";
      let duration = "";
      let trailer = $("#main #content .section-content .trailer iframe").attr(
        "src"
      );
      let age = "";
      let genre = "";

      movieMetas.each((index, element) => {
        if ($(element).text().includes("Diễn viên")) {
          cast = $(element).text().replace("Diễn viên: ", "");
        }
        if ($(element).text().includes("Thời lượng")) {
          duration = $(element).text().replace("Thời lượng: ", "");
        }
        if ($(element).text().includes("Phân loại:")) {
          age = $(element).find(".text-uppercae").text();
        }
        if ($(element).text().includes("Thể loại")) {
          genre = $(element).text().replace("Thể loại: ", "");
        }
        if ($(element).text().includes("Đạo diễn")) {
          director = $(element).text().replace("Đạo diễn: ", "");
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
