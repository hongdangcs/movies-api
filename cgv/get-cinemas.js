const axios = require("axios");
const cheerio = require("cheerio");
/*
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
        try {
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
        } catch (error) {
          console.log(error);
        }
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
*/
async function getCgvCinema(browser) {
  let cgvCinemas = [];
  let page = await browser.newPage();
  await page.goto("https://www.cgv.vn/default/cinox/site/");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  let cinemaList = await page.$$(".cinemas-list ul li");
  for (const cinema of cinemaList) {
    let cinemaName = await cinema.$eval("span", (span) => span.textContent);
    let cinemaId = await cinema.$eval("span", (span) => span.id);
    cinemaId = cinemaId.split("_")[2];
    let cityId = await cinema.evaluate((li) => li.className);
    let cinemaLink = await cinema.$eval("span", (span) =>
      span.getAttribute("onclick")
    );
    let latitude = "";
    let longitude = "";
    cinemaLink = cinemaLink.split("'")[1];
    let addressPage = await browser.newPage();
    await addressPage.goto(cinemaLink);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let cinemaAddress = await addressPage.$(
      ".theater-infomation .theater-address"
    );
    let cinemaAddressText = await cinemaAddress.evaluate(
      (el) => el.textContent
    );
    try {
      let mapLink = await addressPage.$(
        ".theater-infomation .location a.iframe.cboxElement"
      );
      let mapLinkText = await mapLink.evaluate((el) => el.getAttribute("href"));
      let mapLinkTextSplit = mapLinkText.split("!2d")[1];
      longitude = mapLinkTextSplit.split("!3d")[0];
      latitude = mapLinkTextSplit.split("!3d")[1].split("!")[0];
    } catch (error) {
      console.log("error getting lat long: ", cinemaName);
    }
    let cinemaDetails = {
      cinema_id: cinemaId,
      cinema_name: cinemaName,
      cinemas_id: "CGV",
      city_id: cityId,
      address: cinemaAddressText,
      latitude: latitude,
      longitude: longitude,
    };
    cgvCinemas.push(cinemaDetails);
    await addressPage.close();
  }
  await page.close();
  return cgvCinemas;
}

module.exports = getCgvCinema;
