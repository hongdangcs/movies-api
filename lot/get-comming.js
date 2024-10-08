const axios = require("axios");
const qs = require("qs");
let data = qs.stringify({
  paramList:
  '{"MethodName":"GetMovies","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0","multiLanguageID":"LL","division":1,"moviePlayYN":"N","orderType":"5","blockSize":100,"pageNo":1}',
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://www.lottecinemavn.com/LCWS/Movie/MovieData.aspx",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
};

async function getLotteCommingMovies() {
  let commingMovies = [];
  
  await axios
    .request(config)
    .then((response) => {
      movies = response.data.Movies.Items;
      movies.forEach((movie) => {
        commingMovies.push(movie.RepresentationMovieCode);
      });
    })
    .catch((error) => {
    });
  return commingMovies;
}

module.exports = getLotteCommingMovies;
