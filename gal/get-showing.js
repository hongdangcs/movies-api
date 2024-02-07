const axios = require("axios");
const { gal } = require("../config");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.galaxycine.vn/api/v2/mobile/sessions?includeMovie=true",
  headers: {
    clientid: gal.gal_client_id,
  },
};

async function getGalShowingMovies() {
  let showingMovies = [];

  await axios
    .request(config)
    .then((response) => {
      let showing = response.data.data.result;
      showing.forEach((movie) => {
        showingMovies.push(movie.movie.slug);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  // remove duplicate movies
  showingMovies = [...new Set(showingMovies)];

  return showingMovies;
}

module.exports = getGalShowingMovies;
