const axios = require("axios");
const cheerio = require("cheerio");
const getBuildId = require("./get-buildId");

async function getGalMovieDetails(movieId) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  let buildId = await getBuildId();
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
    .then((response) => {
      let movie = response.data.pageProps.movieDetail;
      let directors = movie.directors.map((director) => director.name);
      let directorsString = directors.join(", ");
      let actors = movie.actors.map((actor) => actor.name);
      let actorsString = actors.join(", ");
      let genres = movie.categories.map((categories) => categories.name);
      let genresString = genres.join(", ");

      let description = cheerio.load(movie.description);
      description = description.text();
      movieDetails = {
        movie_id_gal: movieId,
        movie_name: movie.name,
        poster: movie.imagePortrait,
        description: description,
        director: directorsString,
        cast: actorsString,
        running_time: movie.duration,
        trailer: movie.trailer,
        age: movie.age,
        genre: genresString,
      };
    })
    .catch((error) => {
      console.log(error);
    });
  return movieDetails;
}

module.exports = getGalMovieDetails;
