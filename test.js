const getBhdCinemas = require("./bhd/get-cinemas");
const getBhdCommingMovies = require("./bhd/get-comming");
const getBhdMovieDetails = require("./bhd/get-details");
const getSession = require("./bhd/get-session");
const getBhdShowingMovies = require("./bhd/get-showing");
const bhdGetShowtimes = require("./bhd/get-showtimes");
const { getCommingDate } = require("./getCommingDate");
const getLotCinemas = require("./lot/get-cinemas");
const getLotteCommingMovies = require("./lot/get-comming");
const getLotMovieDetails = require("./lot/get-movie-details");
const getLotteShowingMovies = require("./lot/get-showing");
const getLotShowtimes = require("./lot/get-showtimes");

getLotShowtimes("1|0007|8045", 20241002).then((data) => {
  console.log(data);
});
