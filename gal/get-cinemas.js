const axios = require("axios");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.galaxycine.vn/api/v2/mobile/cinemas",
};

async function getGalCinemas() {
  let galCinemas = [];
  try {
    const response = await axios.request(config);
    const cinemas = response.data.data.result;
    cinemas.forEach((cinema) => {
      galCinemas.push({
        cinema_id: cinema.id,
        cinema_name: cinema.name,
        cinemas_id: "GAL",
        city_id: cinema.cityId,
        address: cinema.address,
        latitude: cinema.latitude,
        longitude: cinema.longitude,
      });
    });
  } catch (error) {
    console.log(error);
  }
  return galCinemas;
}

module.exports = getGalCinemas;
