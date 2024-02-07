const axios = require("axios");
const server_configs = require("../config");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.galaxycine.vn/api/v2/mobile/movies/comming",
  headers: {
    clientId: server_configs.gal.gal_client_id,
  },
};

async function getGalCommingMovies() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let commingMovies = [];

  await axios
    .request(config)
    .then((response) => {
      let comming = response.data.data.result;
      comming.forEach((movie) => {
        commingMovies.push(movie.slug);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return commingMovies;
}

module.exports = getGalCommingMovies;
