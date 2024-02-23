const axios = require("axios");
async function getBuildId() {
  buildId = "";
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://www.galaxycine.vn/booking/",
    headers: {},
  };

  await axios
    .request(config)
    .then((response) => {
      let data = response.data.split("buildId")[1];
      buildId = data.split('"')[2];
    })
    .catch((error) => {
      console.log(error);
    });
  return buildId;
}
module.exports = getBuildId;
