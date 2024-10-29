const axios = require("axios");
const qs = require("qs");
const savePoster = require('../download-image');

async function getLotMovieDetails(movieId) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
    let movieDetails = {};

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
    .then(async (response) => {
        let movieData = response.data.Movie;
        let name = movieData.MovieName;
        let poster = movieData.PosterURL;
        let description = movieData.Synopsis;
        let director = movieData.DirectorName;
        let cast = movieData.ActorName;
        let duration = movieData.PlayTime;
        let genre = movieData.MovieGenreName;
        let age = movieData.ViewGradeCode;
        let releaseDate = movieData.ReleaseDate;

        let trailerData = response.data.Trailer.Items;
        let trailer = "";
        if (trailerData.length > 0) {
            trailer = trailerData[0].MediaURL;
        }

        let poster_ext = poster.split(".").pop();
        let image_name = movieId + "." + poster_ext;

        let error = await savePoster(poster, image_name);
        if (error === false) {
            console.log("Movie ID error: ", movieId);
            image_name = poster;
        }


        movieDetails = {
            movie_id_lot: movieId,
            movie_name: name,
            poster: image_name,
            description: description,
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


module.exports = getLotMovieDetails;
