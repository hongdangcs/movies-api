const express = require("express");
const axios = require("axios");
const router = express.Router();
const qs = require("qs");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(
    '<a href="/phim-dang-chieu">Phim đang chiếu</a><br><a href="/phim-sap-chieu">Phim sắp chiếu</a>'
  );
});

app.get("/phim-dang-chieu", (req, res) => {
  let data = qs.stringify({
    paramList:
      '{"MethodName":"GetMovies","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","division":1,"moviePlayYN":"Y","orderType":"1","blockSize":100,"pageNo":1}\n',
  });

  // non active: moviePlayYN: N

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Movie/MovieData.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  cinemas = [];

  let dataCinemas = qs.stringify({
    paramList:
      '{"MethodName":"GetCinemaByArea","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","divisionCode":"1","detailDivisionCode":"1"}',
  });

  let configCinemas = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Cinema/CinemaData.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: dataCinemas,
  };

  axios
    .request(configCinemas)
    .then((response) => {
      cinemas = response.data.Cinemas.Items.map((item) => ({
        name: item.CinemaName,
        code: item.CinemaID,
      }));
    })
    .catch((error) => {
      console.log(error);
    });

  axios
    .request(config)
    .then((response) => {
      const movies = response.data.Movies.Items.map((item) => ({
        name: item.MovieName,
        code: item.RepresentationMovieCode,
      }));
      resString = "";
      movies.forEach((movie) => {
        resString += `<a href="/movie-details/${movie.code}">${movie.name}</a><br>`;
      });
      resString += `<form method="post" action="/movies-cinemas">`;
      resString += `<select name="movie">`;
      movies.forEach((movie) => {
        resString += `<option value="${movie.code}">${movie.name}</option>`;
      });
      resString += `</select>`;
      resString += `<select name="cinema">`;
      cinemas.forEach((cinema) => {
        resString += `<option value="${cinema.code}">${cinema.name}</option>`;
      });
      resString += `</select>`;
      resString += `<input type="submit" value="Submit">`;
      resString += `</form>`;
      resString += `<br>`;
      res.send(resString);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/phim-sap-chieu", (req, res) => {
  let data = qs.stringify({
    paramList:
      '{"MethodName":"GetMovies","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","division":1,"moviePlayYN":"N","orderType":"1","blockSize":100,"pageNo":1}\n',
  });

  // non active: moviePlayYN: N

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Movie/MovieData.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      const movieNames = response.data.Movies.Items.map(
        (item) => item.MovieName
      );
      resString = "";
      movieNames.forEach((movieName) => {
        resString += `<p>${movieName}</p>`;
      });
      res.send(resString);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/movie-details/:code", (req, res) => {
  movieCode = req.params.code;

  let data = qs.stringify({
    paramList:
      '{"MethodName":"GetMovieDetail","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","representationMovieCode":"' +
      movieCode +
      '"}',
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Movie/MovieData.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      resString = "";
      resString += `<img src="${response.data.Movie.PosterURL}"/>`;
      resString += `<h1>${response.data.Movie.MovieName}</h1>`;
      resString += `<p>${response.data.Movie.Synopsis}</p>`;
      res.send(resString);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.use(express.urlencoded({ extended: true }));
app.post("/movies-cinemas", (req, res) => {
  movieCode = req.body.movie;
  cinemaCode = req.body.cinema;
  let data = qs.stringify({
    paramList: `{"MethodName":"GetPlaySequence","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","playDate":"20240120","cinemaID":"1|0001|${cinemaCode}","representationMovieCode":"${movieCode}","representationDivisionCode":"1","representationTypeCode":"1","representationClassCode":"1","screenDivisionCode":"1","osCode":"1","multiLanguageID":"LL","bookingYN":"N","representationMovieName":"${movieCode}","representationStartTime":"202401201200","representationEndTime":"202401201200","cinemaName":"${cinemaCode}","cinemaDivisionCode":"1","cinemaDivisionName":"${cinemaCode}","cinemaDetailDivisionCode":"1","cinemaDetailDivisionName":"${cinemaCode}","cinemaCode":"${cinemaCode}","cinemaID":"1|0001|${cinemaCode}","cinemaGroupCode":"1","cinemaGroupName":"${cinemaCode}","cinemaGroupID":"1|0001|${cinemaCode}","cinemaGroupDivisionCode":"1","cinemaGroupDivisionName":"${cinemaCode}","cinemaGroupDetailDivisionCode":"1","cinemaGroupDetailDivisionName":"${cinemaCode}","cinemaGroupCode":"${cinemaCode}","cinemaGroupID":"1|0001|${cinemaCode}","cinemaGroupDivisionCode":"1","cinemaGroupDivisionName":"${cinemaCode}","cinemaGroupDetailDivisionCode":"1","cinemaGroupDetailDivisionName":"${cinemaCode}","cinemaGroupCode":"${cinemaCode}","cinemaGroupID":"1|0001|${cinemaCode}","cinemaGroupDivisionCode":"1","cinemaGroupDivisionName":"${cinemaCode}","cinemaGroupDetailDivisionCode":"1","cinemaGroupDetailDivisionName":"${cinemaCode}","cinemaGroupCode":"${cinemaCode}","cinemaGroupID":"1|0001|${cinemaCode}","cinemaGroupDivisionCode":"1","cinemaGroupDivisionName":"${cinemaCode}","cinemaGroupDetailDivisionCode":"1","cinemaGroupDetailDivisionName":"${cinemaCode}","cinemaGroupCode":"${cinemaCode}","cinemaGroupID":"1|0001|${cinemaCode}","cinemaGroupDivisionCode":"1","cinemaGroupDivisionName":"${cinemaCode}","cinemaGroupDetailDivisionCode":"1","cinemaGroupDetailDivisionName":"${cinemaCode}","cinemaGroupCode":""}`,
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

  axios
    .request(config)
    .then((response) => {
      resString = "";
      movieName = response.data.PlaySeqsHeader.Items[0].MovieName;
      cinemaName = response.data.PlaySeqsHeader.Items[0].CinemaName;
      resString += `<h1>Phim: ${movieName}</h1>`;

      const playSequences = response.data.PlaySeqs.Items;
      playSequences.forEach((playSequence) => {
        resString += `<h3>Giờ bắt đầu: ${playSequence.StartTime}</h3>`;
        resString += `<h3>Phòng: ${playSequence.ScreenName}</h3>`;
        resString += `<div style = "width = 100%; height = 2px; background-color = black;"></div>`;
      });
      res.send(resString);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
