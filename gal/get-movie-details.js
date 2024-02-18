const axios = require("axios");

async function getGalMovieDetails(movieId) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://www.galaxycine.vn/_next/data/UuAh2GDJrFZlGK8gqdlFG/vi/dat-ve/" +
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
      movieDetails = {
        movie_id_gal: movieId,
        movie_name: movie.name,
        poster: movie.imageLandscape,
        description: movie.description,
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
