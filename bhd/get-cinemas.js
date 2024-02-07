const axios = require("axios");
const cheerio = require("cheerio");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.bhdstar.vn/he-thong-rap/",
};
async function getBhdCinemas() {
  let bhdCinemas = [];

  await axios
    .request(config)
    .then(async (response) => {
      const $ = cheerio.load(response.data);
      const cinemas = $(".post-item");

      const promises = cinemas.map(async (index, element) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const cinema = $(element);
        const cinemaLink = cinema.find("a").attr("href");
        const cinemaDetails = await getBhdCinemaDetails(cinemaLink);
        bhdCinemas.push(cinemaDetails);
      });

      await Promise.all(promises.toArray());
    })
    .catch((error) => {
      console.log(error);
    });

  return bhdCinemas;
}

async function getBhdCinemaDetails(cinemaLink) {
  let cinemaDetails = {};
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: cinemaLink,
  };
  await axios
    .request(config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const cinemaName = $("#content .content .content--title").text();
      let cinemaAddress = $("#content .content ul li").first().text();
      let cinemaId = $("#content h1.title").first().text();
      cinemaAddress = cinemaAddress.replace("Địa điểm: ", "");
      let cityId = $(".page-title .taxonomy.tinh-thanh").first().attr("href");
      cityId = cityId.split("/")[4];
      cinemaDetails = {
        cinema_id: cinemaId,
        cinema_name: cinemaName,
        cinemas_id: "BHD",
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

module.exports = getBhdCinemas;
