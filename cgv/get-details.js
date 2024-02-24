async function getCgvMovieDetails(browser, movieId) {
  let id = "";
  if (movieId.includes("_")) {
    id = movieId.split("_")[0];
  } else {
    id = movieId;
  }

  let movieDetails = {};
  let movieName = "";
  let movieImage = "";
  let descreptionText = "";
  let director = "";
  let cast = "";
  let genre = "";
  let duration = "";
  let age = "";
  let trailer = "";
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.cgv.vn/default/${id}.html`);
    //   await page.waitForNavigation();
    try {
      movieName = await page.$eval(
        ".product-view .product-shop .product-name .h1",
        (el) => el.textContent
      );
    } catch (error) {}
    try {
      movieImage = await page.$eval(
        ".product-view .product-img-box #image-main",
        (el) => el.src
      );
    } catch (error) {}
    try {
      let descreption = await page.$$(
        ".product-view .product-collateral .tab-content"
      );
      try {
        descreptionText = await descreption[0].$eval(
          ".std",
          (el) => el.textContent
        );
      } catch (error) {}
      try {
        trailer = await descreption[1].$eval(
          ".product_view_trailer iframe",
          (el) => el.src
        );
      } catch (error) {}
    } catch (error) {}
    try {
      director = await page.$eval(
        ".movie-director.movie-info .std",
        (el) => el.textContent
      );
    } catch (error) {}
    try {
      let movieActress = await page.$$(".movie-actress.movie-info");

      try {
        cast = await movieActress[0].$eval(".std", (el) => el.textContent);
      } catch (error) {}
      try {
        duration = await movieActress[1].$eval(".std", (el) => el.textContent);
      } catch (error) {
        console.log("duration not found" + movieId);
      }
    } catch (error) {}
    try {
      genre = await page.$eval(
        ".movie-genre.movie-info .std",
        (el) => el.textContent
      );
    } catch (error) {}
    try {
      age = await page.$eval(
        ".movie-rating.movie-rated-web .std",
        (el) => el.textContent
      );
    } catch (error) {}

    movieDetails = {
      movie_id_cgv: movieId,
      movie_name: movieName,
      poster: movieImage,
      description: descreptionText,
      director: director,
      cast: cast,
      running_time: duration,
      trailer: trailer,
      age: age,
      genre: genre,
    };
  } catch (error) {
    console.error(error);
  } finally {
    await page.close();
  }
  return movieDetails;
}

module.exports = { getCgvMovieDetails };
