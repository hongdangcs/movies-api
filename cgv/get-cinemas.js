const axios = require("axios");
const cheerio = require("cheerio");

async function getCgvCinemas() {
  let cgvCinemas = [];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://www.cgv.vn/default/cinox/site/cgv-rach-gia",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    },
  };

  await axios
    .request(config)
    .then(async (response) => {
      let $ = cheerio.load(response.data);
      let cinemasList = $(".cinemas-list ul li");
      const promises = cinemasList.map(async (index, element) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let cinemaName = $(element).find("span").text();
        let cinemaId = $(element).find("span").attr("id");
        let cityId = $(element).attr("class");
        let cinemaLink = $(element).find("span").attr("onclick");
        cinemaLink = cinemaLink.split("'")[1];
        const cinemaDetails = await getCgvCinemaDetail(
          cinemaLink,
          cinemaName,
          cinemaId,
          cityId
        );
        cgvCinemas.push(cinemaDetails);
      });
      await Promise.all(promises.toArray());
    })
    .catch((error) => {
      console.log(error);
    });
  return cgvCinemas;
}
async function getCgvCinemaDetail(cinemaLink, cinemaName, cinemaId, cityId) {
  let cinemaDetails = {};

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: cinemaLink,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    },
  };

  await axios
    .request(config)
    .then((response) => {
      let $ = cheerio.load(response.data);
      let cinemaAddress = $(".theater-infomation .theater-address").text();
      cinemaDetails = {
        cinema_id: cinemaId,
        cinema_name: cinemaName,
        cinemas_id: "CGV",
        city_id: cityId,
        address: cinemaAddress,
        latitude: "",
        longitude: "",
      };
    })
    .catch((error) => {
      console.log(error);
    });

  return cinemaDetails;
}

module.exports = getCgvCinemas;
