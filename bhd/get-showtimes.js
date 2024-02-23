const axios = require("axios");
const { convertDateFormat } = require("../getCommingDate");
const cheerio = require("cheerio");
const qs = require("qs");

async function bhdGetShowtimes(movieId, date, session) {
  let showtimes = [];
  let id = movieId.split("_")[0];

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://bhdstar.vn/wp-admin/admin-ajax.php?action=ldapp_order_get_schedule&orderDate=${convertDateFormat(
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

/*
async function bhdGetShowtimes(movieId) {
  let showtimes = [];
  let data = qs.stringify({
    action: "bhd_lichchieu_chonphim",
    movies_id: movieId,
    post_id: movieId,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.bhdstar.vn/wp-admin/admin-ajax.php",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const lists = $(".list--film-type .item--film-type");
      for (const list of lists) {
        $(list).find(".type .film-rating").remove();
        let format = $(list)
          .find(".type")
          .text()
          .replace(/\t/g, "")
          .replace(/\n/g, "")
          .replace(/\s/g, "");
        let date = $(list).find("ul.times").attr("class").split("date_")[1];
        date = date.split(" ")[0];
        date = date.replace(/-/g, "");
        let times = $(list).find("ul.times li a.time");
        for (const time of times) {
          let startTime = $(time).text();
          let cinemaId = $(time)
            .attr("href")
            .split("cinemacode=")[1]
            .split("&")[0];
          showtimes.push({
            cinemas_id: "BHD",
            movie_id: movieId,
            cinema_id: cinemaId,
            date: date,
            start_time: startTime,
            movie_format: format,
          });
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return showtimes;
}

module.exports = bhdGetShowtimes;
*/
