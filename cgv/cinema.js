const axios = require("axios");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.cgv.vn/default/cinox/site/cgv-ho-guom-plaza",
  headers: {},
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
