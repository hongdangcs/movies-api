const axios = require("axios");
const qs = require("qs");

async function getLotShowtimes(cinemaId, date) {
  let showtimes = [];
  let data = qs.stringify({
    paramList:
      '{"MethodName":"GetPlaySequence","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0","playDate":"' +
      date +
      '","cinemaID":"' +
      cinemaId +
      '","representationMovieCode":""}',
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Ticketing/TicketingData.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      console.log(response.data);
      
      let data = response.data.PlaySeqs.Items;
      let movieFormats = response.data.PlaySeqsHeader.Items;
      data.forEach((showtime) => {
        let movieId = showtime.RepresentationMovieCode;
        let time = showtime.StartTime;
        let format = "";
        movieFormats.forEach((movieFormat) => {
          if (
            movieFormat.ScreenDivisionCode === showtime.ScreenDivisionCode &&
            movieFormat.RepresentationMovieCode ===
              showtime.RepresentationMovieCode &&
            movieFormat.CinemaID === showtime.CinemaID
          ) {
            format =
              movieFormat.FilmName +
              " | " +
              movieFormat.TranslationDivisionName +
              " | " +
              movieFormat.ScreenDivisionName;
          }
        });

        showtimes.push({
          cinemas_id: "LOT",
          movie_id: movieId,
          cinema_id: cinemaId,
          date: date,
          start_time: time,
          movie_format: format,
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return showtimes;
}

module.exports = getLotShowtimes;
