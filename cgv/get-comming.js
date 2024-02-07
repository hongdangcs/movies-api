async function getCgvComming(browser) {
  const page = await browser.newPage();
  await page.goto("https://www.cgv.vn/default/movies/coming-soon-1.html");
  // wait for navigation
  await page.waitForNavigation();
  const result = await page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll(
      ".category-products.cgv-movies .film-lists.item.last"
    );
    elements.forEach((element) => {
      let id = element.querySelector(".product-image").getAttribute("href");
      id = id.split("default/")[1].split(".html")[0];
      try {
        let subId = element
          .querySelector(".button.btn-booking")
          .getAttribute("onclick");
        subId = subId.split("'")[1];
        id = id + "_" + subId;
      } catch (error) {}
      data.push(id);
    });
    return data;
  });
  await page.close();
  return result;
}

module.exports = { getCgvComming };