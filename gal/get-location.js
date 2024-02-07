const axios = require("axios");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.galaxycine.vn/api/v2/mobile/locations",
};

async function getLocations() {
  let locationsReturn = [];
  try {
    const response = await axios.request(config);
    const locations = response.data.data.result;
    locations.forEach((location) => {
      locationsReturn.push({
        id_gal: location.id,
        name: location.name,
      });
    });
  } catch (error) {
    console.log(error);
  }
  return locationsReturn;
}
module.exports = { getLocations };
