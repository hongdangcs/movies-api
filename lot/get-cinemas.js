const axios = require("axios");
const qs = require("qs");

// HCMC: detailDivisionCode: 1,
// Hanoi: detailDivisionCode: 2,
// DB Song Hong: detailDivisionCode: 3,
// Dong Bac, Tay Bac: detailDivisionCode: 4,
// Bac Mien Trung: detailDivisionCode: 5,
// Tay Nam: detailDivisionCode: 6,
// Dong Nam Bo: detailDivisionCode: 7,

async function getLotCinemas() {
  let lotCinema = [];
  let promises = [];
  for (let i = 1; i < 9; i++) {
    // delay 3s
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let data = qs.stringify({
      paramList:
        '{"MethodName":"GetCinemaByArea","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","divisionCode":"1","detailDivisionCode":"' +
        i +
        '"}',
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://www.lottecinemavn.com/LCWS/Cinema/CinemaData.aspx",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: data,
    };

    let promise = axios
      .request(config)
      .then((response) => {
        let data = response.data;
        let cinemas = data.Cinemas.Items;

        let cinemaPromises = cinemas.map(async (cinema) => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          try {
            let divisionCode = cinema.DivisionCode;
            let detailDivisionCode = cinema.DetailDivisionCode;
            let cinemaID = cinema.CinemaID;
            let cinemaDetails = await getCinemaDetail(
              divisionCode,
              detailDivisionCode,
              cinemaID
            );
            lotCinema.push(cinemaDetails);
          } catch (error) {
            console.log(error);
          }
        });

        return Promise.all(cinemaPromises);
      })
      .catch((error) => {
        console.log(error);
      });

    promises.push(promise);
  }
  await Promise.all(promises);
  return lotCinema;
}

async function getCinemaDetail(divisionCode, detailDivisionCode, cinemaID) {
  let cinemaDetails = [];
  let data = qs.stringify({
    paramList:
      '{"MethodName":"GetCinemaDetailItem","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","divisionCode":"' +
      divisionCode +
      '","detailDivisionCode":"' +
      detailDivisionCode +
      '","cinemaID":"' +
      cinemaID +
      '","memberOnNo":0}',
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.lottecinemavn.com/LCWS/Cinema/CinemaData.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      let data = response.data;
      let cinemaDetail = data.CinemaDetail;
      cinemaDetails = {
        cinema_id:
          "" +
          cinemaDetail.DivisionCode +
          "|" +
          cinemaDetail.DetailDivisionCode +
          "|" +
          cinemaDetail.CinemaID,
        cinema_name: "Lotte " + cinemaDetail.CinemaName,
        cinemas_id: "LOT",
        city_id: cinemaDetail.Province,
        address: cinemaDetail.Address,
        latitude: cinemaDetail.Latitude,
        longitude: cinemaDetail.Longitude,
      };
    })
    .catch((error) => {
      console.log(error);
    });
  return cinemaDetails;
}

module.exports = getLotCinemas;
