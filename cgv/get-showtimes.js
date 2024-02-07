const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

async function getCgvShowtimes(movieId, date) {
  id = movieId.split("_")[1];
  let showtimes = [];

  let data = qs.stringify({
    id: id,
    dy: date,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.cgv.vn/default/cinemas/product/ajaxschedule/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  try {
    await axios
      .request(config)
      .then((response) => {
        const $ = cheerio.load(response.data);
        let movieFormats = $(
          "div.tabs.tabs-cgv-movie-type dl.collateral-tabs dt.tab"
        );
        let movieInfor = $(
          "div.tabs.tabs-cgv-movie-type dl.collateral-tabs dd.tab-container"
        );
        movieFormats.each((index, element) => {
          let movieFormat = $(element).find("span").text();
          let movieLink = $(movieInfor[index]).find(
            "ul.products-grid-movie li a"
          );
          try {
            movieLink.each((index, element) => {
              let time = $(element).find("span").text();
              let cinema = $(element).attr("href").split("/")[8];
              showtimes.push({
                movie_id: movieId,
                cinema_id: "cgv_site_" + cinema,
                date: date,
                start_time: time,
                movie_format: movieFormat,
              });
            });
          } catch (error) {
            console.log(error);
          }
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

module.exports = getCgvShowtimes;
