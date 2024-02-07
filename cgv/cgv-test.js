const puppeteer = require("puppeteer");
const getCgvShowing = require("./get-showing");
const { getCgvComming } = require("./get-comming");
let browser;
async function startPuppeteer() {
  browser = await puppeteer.launch({ headless: "new" });
}
startPuppeteer().then(async () => {
  getCgvComming(browser).then((result) => {
    console.log(result);
  });
});
