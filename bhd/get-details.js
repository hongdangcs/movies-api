/*
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
*/
const axios = require("axios");
const cheerio = require("cheerio");
const savePoster = require("../download-image");

async function getBhdMovieDetails(movieId) {
  let movieIdSlug = movieId.split("_")[1];
  let movieDetails = {};

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://bhdstar.vn/phim/${movieIdSlug}/`,
  };

  await axios
    .request(config)
    .then(async (response) => {
        let $ = cheerio.load(response.data);
        let movieName = $("#main #content h1.title.text-uppercase").text();
        let movieImage = $("#main #content .img-inner.dark img").attr("src");
        let descreption = $("#main #content .excerpt").text();
        // remove \n and \t
        descreption = descreption.replace(/\n|\t/g, "");
        let movieMetas = $("#main #content .meta p");
        let director = "";
        let cast = "";
        let duration = "";
        let trailer = $("#main #content .section-content .trailer iframe").attr(
            "src"
        );
        let age = "";
        let genre = "";
        let releaseDate = "";

        const image_ext = movieImage.split(".").pop();
        let  imagePath = `${movieId}.${image_ext}`;

        let error = await savePoster(movieImage, imagePath);
        if  (error === false) {
            console.log("Movie ID error: ", movieId);
            imagePath = movieImage;
        }
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
            if ($(element).text().includes("Khởi chiếu:")) {
                releaseDate = $(element).text().replace("Khởi chiếu:", "");
                releaseDate = releaseDate.split("/").reverse().join("");
            }
        });

        movieDetails = {
            movie_id_bhd: movieId,
            movie_name: movieName,
            poster: imagePath,
            description: descreption,
            director: director,
            cast: cast,
            running_time: duration,
            trailer: trailer,
            age: age,
            genre: genre,
            release_date: releaseDate,
        };
    })
    .catch((error) => {
      console.log(error);
    });
  return movieDetails;
}

module.exports = getBhdMovieDetails;
