const axios = require("axios");
const cheerio = require("cheerio");
const savePoster = require("../download-image");

async function getGalMovieDetails(movieId, buildId) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://www.galaxycine.vn/_next/data/" +
      buildId +
      "/vi/dat-ve/" +
      movieId +
      ".json",
  };
  let movieDetails = {};
  await axios
    .request(config)
    .then(async (response) => {
        let movie = response.data.pageProps.movieDetail;
        let directors = movie.directors.map((director) => director.name);
        let directorsString = directors.join(", ");
        let actors = movie.actors.map((actor) => actor.name);
        let actorsString = actors.join(", ");
        let genres = movie.categories.map((categories) => categories.name);
        let genresString = genres.join(", ");
        let releaseDate = movie.startDate;
        releaseDate = releaseDate.split(" ")[0].replace(/-/g, "");

        const image_ext = movie.imagePortrait.split(".").pop();
        let imagePath = `${movieId}.${image_ext}`;

        let error = await savePoster(movie.imagePortrait, imagePath);
        if (error === false) {
            console.log("Movie ID error: ", movieId);
            imagePath = movie.imagePortrait;
        }

        let description = cheerio.load(movie.description);
        description = description.text();
        movieDetails = {
            movie_id_gal: movieId,
            movie_name: movie.name,
            poster: imagePath,
            description: description,
            director: directorsString,
            cast: actorsString,
            running_time: movie.duration,
            trailer: movie.trailer,
            age: movie.age,
            genre: genresString,
            release_date: releaseDate,
        };
    })
    .catch((error) => {
      console.log(error);
    });
  return movieDetails;
}

module.exports = getGalMovieDetails;
