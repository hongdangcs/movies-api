const axios = require("axios");
const qs = require("qs");

async function getLotMovieDetails(movieId) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  movieDetails = {};

  let data = qs.stringify({
    paramList:
      '{"MethodName":"GetMovieDetail","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","representationMovieCode":"' +
      movieId +
      '"}',
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Movie/MovieData.aspx",
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      let movieData = response.data.Movie;
      let name = movieData.MovieName;
      let poster = movieData.PosterURL;
      let description = movieData.Synopsis;
      let director = movieData.DirectorName;
      let cast = movieData.ActorName;
      let duration = movieData.PlayTime;
      let genre = movieData.MovieGenreName;
      let age = movieData.ViewGradeCode;

      let trailerData = response.data.Trailer.Items;
      let trailer = "";
      if (trailerData.length > 0) {
        trailer = trailerData[0].MediaURL;
      }

      movieDetails = {
        movie_id_lot: movieId,
        movie_name: name,
        poster: poster,
        description: description,
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

module.exports = getLotMovieDetails;
