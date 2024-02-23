async function getCgvComming(browser) {
  const page = await browser.newPage();
  await page.goto("https://www.cgv.vn/default/movies/coming-soon-1.html");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // const movies = await page.$$(
  //   ".category-products.cgv-movies .film-lists.item.last"
  // );
  // console.log(movies.length);
  // let result = [];
  // for (let i = 0; i < movies.length; i++) {
  //   let id = await (
  //     await movies[i].$(".product-image").getProperty("href")
  //   ).jsonValue();
  //   id = id.split("default/")[1].split(".html")[0];
  //   try {
  //     let subId =
  //       (await movies[i].$(".button.btn-booking")) &&
  //       (
  //         await (
  //           await movies[i].$(".button.btn-booking")
  //         ).getProperty("onclick")
  //       ).jsonValue();
  //     subId = subId.split("'")[1];
  //     id = id + "_" + subId;
  //   } catch (error) {}
  //   result.push(id);
  // }
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
