const puppeteer = require("puppeteer");
const getCgvShowing = require("./get-showing");
const { getCgvComming } = require("./get-comming");
const getCgvCinema = require("./get-cinemas");
let browser;
async function startPuppeteer() {
  browser = await puppeteer.launch({ headless: false });
}
startPuppeteer().then(async () => {
  getCgvComming(browser).then((result) => {
    console.log(result);
  });
});
