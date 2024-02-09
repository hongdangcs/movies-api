const axios = require("axios");
const { convertDateFormat } = require("../getCommingDate");
const cheerio = require("cheerio");

async function bhdGetShowtimes(movieId, date, session) {
  let showtimes = [];
  let id = movieId.split("_")[0];

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://www.bhdstar.vn/wp-admin/admin-ajax.php?action=ldapp_order_get_schedule&orderDate=${convertDateFormat(
      date
    )}&f=${id}&nonce=${session}`,
  };
  try {
    await axios
      .request(config)
      .then((response) => {
        let data = response.data.data;
        data.forEach((showtime) => {
          let sessions = showtime.sessions;
          sessions.forEach((session) => {
            showtimes.push({
              cinemas_id: "BHD",
              movie_id: movieId,
              cinema_id: showtime.title,
              date: date,
              start_time: session.time,
              movie_format: session.format,
            });
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
  return showtimes;
}

module.exports = bhdGetShowtimes;
