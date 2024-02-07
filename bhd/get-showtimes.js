const axios = require("axios");

async function bhdGetShowtimes(movieId, date) {
  let showtimes = [];
  movieId = movieId.split("_")[0];

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://www.bhdstar.vn/wp-admin/admin-ajax.php?action=ldapp_order_get_schedule&orderDate=${date}&f=${movieId}&nonce=f07af1f879`,
  };

  await axios
    .request(config)
    .then((response) => {
      let data = response.data.data;
      data.forEach((showtime) => {
        let sessions = showtime.sessions;
        sessions.forEach((session) => {
          showtimes.push({
            movie_id: movieId,
            cinema_id: showtime.title,
            date: session.date,
            start_time: session.time,
            movie_format: session.format,
          });
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return showtimes;
}

module.exports = bhdGetShowtimes;
