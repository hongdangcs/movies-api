const axios = require("axios");
const { gal } = require("../config");

async function getGalShowtimes() {
  let showtimes = [];

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://www.galaxycine.vn/api/v2/mobile/sessions?includeCinema=true&includeMovie=true",
    headers: {
      clientid: gal.gal_client_id,
    },
  };
  try {
    await axios
      .request(config)
      .then((response) => {
        try {
          let data = response.data.data.result;
          data.forEach((showtime) => {
            let movieId = showtime.movie.slug;
            let cinemaId = showtime.cinema.id;
            let date = showtime.showDate;
            date = date.replace(/-/g, "");
            let time = showtime.showTime;
            let format = showtime.movieFormat;
            showtimes.push({
              cinemas_id: "GAL",
              movie_id: movieId,
              cinema_id: cinemaId,
              date: date,
              start_time: time,
              movie_format: format,
            });
          });
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }

  return showtimes;
}

module.exports = getGalShowtimes;
