const puppeteer = require("puppeteer");
const mysql = require("mysql2");
const getLotCinemas = require("./lot/get-cinemas");
const getGalCinemas = require("./gal/get-cinemas");
const { getLocations } = require("./gal/get-location");
const getBhdCinemas = require("./bhd/get-cinemas");
const server_configs = require("./config");
const getGalCommingMovies = require("./gal/get-comming");
const getGalMovieDetails = require("./gal/get-movie-details");
const getLotCommingMovies = require("./lot/get-comming");
const getLotMovieDetails = require("./lot/get-movie-details");
const getBhdCommingMovies = require("./bhd/get-comming");
const getBhdMovieDetails = require("./bhd/get-details");
const { getCgvComming } = require("./cgv/get-comming");
const { getCgvMovieDetails } = require("./cgv/get-details");
const getLotteShowingMovies = require("./lot/get-showing");
const getBhdShowingMovies = require("./bhd/get-showing");
const getCgvShowing = require("./cgv/get-showing");
const getGalShowingMovies = require("./gal/get-showing");
const getGalShowtimes = require("./gal/get-showtimes");
const { getCommingDate } = require("./getCommingDate");
const bhdGetShowtimes = require("./bhd/get-showtimes");
const getLotShowtimes = require("./lot/get-showtimes");
const getCgvShowtimes = require("./cgv/get-showtimes");
const getCgvCinema = require("./cgv/get-cinemas");
const getSession = require("./bhd/get-session");
const getBuildId = require("./gal/get-buildId");

async function startPuppeteer() {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  return browser;
}

const connection = mysql.createConnection({
  host: server_configs.db.database_host_name,
  user: server_configs.db.database_user_name,
  database: server_configs.db.database_name,
  password: server_configs.db.database_password,
});

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createCinemas() {
  connection.query(
    "Create table if not exists wp_cinemas (id int(11) NOT NULL AUTO_INCREMENT, cinemas_id varchar(255) NOT NULL, cinemas_name varchar(255) NOT NULL, cinemas_link varchar(255), icon_link varchar(255) ,PRIMARY KEY (id))",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
      insertCinemasCheck();
    }
  );
}

function insertCinemasCheck() {
  connection.query("select * from wp_cinemas", function (err, results, fields) {
    if (err) {
      insertErrorLogs(err);
    }
    if (results.length == 0) {
      insertCinemas(
        "LOT",
        "Lotte Cinema",
        "https://lottecinemavn.com/",
        "https://www.lottecinemavn.com/LCHS/Image/Icon/favicon.ico"
      );
      insertCinemas(
        "CGV",
        "CGV",
        "https://www.cgv.vn/",
        "https://www.cgv.vn/skin/frontend/cgv/default/images/cgvlogo.png"
      );
      insertCinemas(
        "BHD",
        "BHD Star",
        "https://www.bhdstar.vn/",
        "https://www.bhdstar.vn/wp-content/uploads/2023/08/logo.png"
      );
      insertCinemas(
        "GAL",
        "Galaxy Cinema",
        "https://www.galaxycine.vn/",
        "https://www.galaxycine.vn/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fgalaxy-logo-mobile.074abeac.png&w=128&q=75"
      );
    }
  });
}

function insertCinemas(cinemas_id, cinemas_name, cinemas_link, icon_link) {
  connection.query(
    "insert into wp_cinemas(cinemas_id, cinemas_name, cinemas_link, icon_link) values(?,?,?,?)",
    [cinemas_id, cinemas_name, cinemas_link, icon_link],
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

async function createCinema() {
  connection.query(
    "Create table if not exists wp_cinema (id int(11) NOT NULL AUTO_INCREMENT, cinema_id varchar(255) NOT NULL, cinema_name varchar(255) NOT NULL, cinemas_id varchar(255) NOT NULL, city_id varchar(255) NOT NULL, address text NOT NULL, latitude varchar(255), longitude varchar(255), PRIMARY KEY (id))",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
  await insertCinemaCheck();
}
/*
 function insertCinemaCheck() {
   connection.query(
    "select * from wp_cinema",
    async function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
        }
      if (results.length == 0) {
        await insertLotCinema();
        await insertGalCinema();
        await insertBhdCinema();
        await insertCgvCinema();
      }
    }
  );
}
*/
async function insertCinemaCheck() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from wp_cinema",
      async function (err, results, fields) {
        if (err) reject(err);
        if (results.length == 0) {
          try {
            await insertLotCinema();
            await insertGalCinema();
            await insertBhdCinema();
            await insertCgvCinema();
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          resolve();
        }
      }
    );
  });
}
async function insertLotCinema() {
  try {
    await getLotCinemas().then((cinemas) => {
      cinemas.forEach((cinema) => {
        insertCinema(
          cinema.cinema_id,
          cinema.cinema_name,
          cinema.cinemas_id,
          cinema.city_id,
          cinema.address,
          cinema.latitude,
          cinema.longitude
        );
      });
    });
  } catch (error) {
    insertErrorLogs(error);
  }
}

async function insertGalCinema() {
  try {
    await getGalCinemas().then((cinemas) => {
      cinemas.forEach((cinema) => {
        insertCinema(
          cinema.cinema_id,
          cinema.cinema_name,
          cinema.cinemas_id,
          cinema.city_id,
          cinema.address,
          cinema.latitude,
          cinema.longitude
        );
      });
    });
  } catch (error) {
    insertErrorLogs(error);
  }
}

async function insertBhdCinema() {
  try {
    await getBhdCinemas().then((cinemas) => {
      cinemas.forEach((cinema) => {
        insertCinema(
          cinema.cinema_id,
          cinema.cinema_name,
          cinema.cinemas_id,
          cinema.city_id,
          cinema.address,
          cinema.latitude,
          cinema.longitude
        );
      });
    });
  } catch (error) {
    insertErrorLogs(error);
  }
}

async function insertCgvCinema() {
  try {
    await getCgvCinema(browser).then((cinemas) => {
      cinemas.forEach((cinema) => {
        insertCinema(
          cinema.cinema_id,
          cinema.cinema_name,
          cinema.cinemas_id,
          cinema.city_id,
          cinema.address,
          cinema.latitude,
          cinema.longitude
        );
      });
    });
  } catch (error) {
    {
      insertErrorLogs(error);
    }
  }
}

function insertCinema(
  cinema_id,
  cinema_name,
  cinemas_id,
  city_id,
  address,
  latitude,
  longitude
) {
  connection.query(
    "insert into wp_cinema(cinema_id, cinema_name, cinemas_id, city_id, address, latitude, longitude) values(?,?,?,?,?,?,?)",
    [cinema_id, cinema_name, cinemas_id, city_id, address, latitude, longitude],
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}
/*
function createLocations() {
  connection.query(
    "Create table if not exists wp_locations (id int(11) NOT NULL AUTO_INCREMENT, location_name varchar(255) NOT NULL, location_id_gal varchar(255), location_id_cgv varchar(255), location_id_lot varchar(255), location_id_bhd varchar(255), PRIMARY KEY (id))",
    async function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
        }
      await insertLocationsCheck();
    }
  );
}
*/
async function createLocations() {
  return new Promise((resolve, reject) => {
    connection.query(
      "Create table if not exists wp_locations (id int(11) NOT NULL AUTO_INCREMENT, location_name varchar(255) NOT NULL, location_id_gal varchar(255), location_id_cgv varchar(255), location_id_lot varchar(255), location_id_bhd varchar(255), PRIMARY KEY (id))",
      async function (err, results, fields) {
        if (err) reject(err);
        try {
          await insertLocationsCheck();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
/*
function insertLocationsCheck() {
  connection.query(
    "select * from wp_locations",
    async function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
        }
      if (results.length == 0) {
        await insertLocations();
      }
    }
  );
}
*/
async function insertLocationsCheck() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from wp_locations",
      async function (err, results, fields) {
        if (err) reject(err);
        if (results.length == 0) {
          insertLocations()
            .then(() => {
              resolve();
            })
            .catch((error) => reject(error));
        } else {
          resolve();
        }
      }
    );
  });
}
async function insertLocations() {
  getLocations().then((locations) => {
    locations.forEach((location) => {
      let id_cgv = "";
      let id_lot = "";
      let id_bhd = "";
      switch (location.id_gal) {
        case "599535ea-1ea2-4393-9b5a-3ba3a807f363":
          id_cgv = "cgv_city_1";
          id_bhd = "tp-ho-chi-minh";
          id_lot = "Ho Chi Minh City";
          break;
        case "f4bf5f53-4e80-40c8-b1e0-f11ffa9a636a":
          id_lot = "Hanoi";
          // id_bhd = "tp-ha-noi";
          id_bhd = "ha-noi";
          id_cgv = "cgv_city_3";
          break;
        case "48def6c3-5254-4ece-b63c-e5524fda1296":
          id_lot = "Da Nang";
          id_cgv = "cgv_city_5";
          break;
        case "c6a74ae6-4f2a-4ad7-8e9e-ba22f05c11a9":
          // id_bhd = "tp-long-khanh";
          id_bhd = "dong-nai";
          id_lot = "Dong Nai Province";
          id_cgv = "cgv_city_9";
          break;
        case "52585552-cd12-445f-99bf-adeee11a7d99":
          id_lot = "Thua Thien-Hue Province";
          id_cgv = "cgv_city_10";
          id_bhd = "tp-hue";
          break;
        case "27b7371b-0f1b-4390-9da0-cc2deba823e7":
          id_lot = "Bac Giang Province";
          break;
        case "f9c6fb89-e24f-424c-bae8-03fdc595eb2d":
          id_lot = "Bac Ninh Province";
          break;
        case "a63ac3fe-d423-46f6-a393-b81876567400":
          id_lot = "Hai Duong Province";
          break;
        case "29ca9635-7ff0-44bf-8793-c97acba3f57a":
          id_lot = "Haiphong";
          id_cgv = "cgv_city_11";
          break;
        case "e56ef19e-1379-45d8-b310-830d8ad9c6ec":
          id_lot = "Nam Dinh Province";
          break;
        case "def71005-002c-4df5-b4ff-07545e74ffa3":
          id_lot = "Ninh Binh Province";
          break;
        case "ef134d5d-f0a4-4ccd-9d4f-bab4cdc196bf":
          id_lot = "Ha Nam Province";
          break;
        case "69f5c427-bcf1-43c1-8f6d-3c8056c5c9ee":
          id_lot = "Thai Binh Province";
          break;
        case "5eb76cb8-055e-4bd5-823e-8163450051c2":
          id_lot = "Quang Ninh Province";
          id_cgv = "cgv_city_13";
          break;
        case "e8e303af-c6ca-405b-bae5-65324e407443":
          id_lot = "Tuyen Quang Province";
          break;
        case "9b6692a8-eaec-4cbf-905f-bf1931956cfd":
          id_lot = "Phu Tho Province";
          id_cgv = "cgv_city_21";
          break;
        case "541b3555-86d4-468a-aff6-03b5455af5ad":
          id_lot = "Quang Binh Province";
          break;
        case "89fe0e35-ddb8-467c-8213-a693ad13e8a7":
          id_lot = "Thanh Hoa Province";
          break;
        case "6c1d6ebc-dfc9-47ca-b0e9-2be7766f68d4":
          id_lot = "Nghe An Province";
          id_cgv = "cgv_city_93";
          break;
        case "f4dd46e5-d1ac-4eff-8d81-028be57f910c":
          id_lot = "Lam Dong Province";
          break;
        case "92501609-f93d-41fe-812b-4e0342b4b9da":
          id_lot = "Quang Nam Province";
          break;
        case "34b721af-15ac-46f9-8d6b-54e86446d05f":
          id_lot = "Khanh Hoa Province";
          id_cgv = "cgv_city_77";
          break;
        case "cbb63a9e-988a-4bb8-b027-682c76f19565":
          id_lot = "Binh Thuan Province";
          break;
        case "444774f9-e856-4248-b1c8-a20fe247fde0":
          id_lot = "Ninh Thuan Province";
          break;
        case "c2ff3ae3-bcdc-4b53-8cb2-962e0afcca03":
          id_lot = "Binh Duong Province";
          id_cgv = "cgv_city_19";
          break;
        case "c6a74ae6-4f2a-4ad7-8e9e-ba22f05c11a9":
          id_lot = "Dong Nai Province";
          break;
        case "8f4c8342-a17b-4951-a06d-8df6e6cf882f":
          id_lot = "Tay Ninh Province";
          id_cgv = "cgv_city_113";
          break;
        case "ae597899-e73a-42f2-b8a7-1a0ac5f29057":
          id_lot = "Ba Ria-Vung Tau Province";
          id_cgv = "cgv_city_15";
          break;
        case "477b975e-caac-4149-8fcc-a10fbde8df84":
          id_lot = "Ca Mau Province";
          break;
        case "3e016c97-d824-4cac-99a5-1de79b3673bc":
          id_lot = "Can Tho";
          id_cgv = "cgv_city_7";
          break;
        case "356d6f3d-5cb6-4392-9abf-84aae78c6573":
          id_lot = "An Giang Province";
          break;
        case "f4bf5f53-4e80-40c8-b1e0-f11ffa9a636a":
          id_cgv = "cgv_city_17";
          break;
        case "95ea07fe-5999-4030-bb5f-abe0440d96f0":
          id_cgv = "cgv_city_21";
          break;
        case "63aeebd5-9a56-4dbd-8c9c-a8c0c5dd3fbc":
          id_cgv = "cgv_city_23";
          break;
        case "0b3538db-7251-47c3-ac46-9c8ace14aa40":
          id_cgv = "cgv_city_25";
          break;
        case "ac58cd32-f288-4d17-bb62-1060b6698b3e":
          id_cgv = "cgv_city_27";
          break;
        case "b9f5f3a0-9383-4636-a948-3c983081fa23":
          id_cgv = "cgv_city_29";
          break;
        case "b0dcbb30-d9c2-4201-a332-675cf97202dc":
          id_cgv = "cgv_city_31";
          break;
        case "627de623-2b31-44b1-bb89-fde2728d0f16":
          id_cgv = "cgv_city_33";
          break;
        case "f2b73b36-73a5-42c0-a364-7839d763fbf2":
          id_cgv = "cgv_city_35";
          break;
        case "0570b62b-2747-4ff1-ad44-bc7140f206b1":
          id_cgv = "cgv_city_49";
          break;
        case "f57e8bac-933b-4959-9268-0dddfe0f0227":
          id_cgv = "cgv_city_57";
          break;
        case "2a229ca6-b78b-421b-80f8-3594464ec5e4":
          id_cgv = "cgv_city_75";
          break;
        case "f223aa91-58d7-45a9-af88-f862036932e0":
          id_cgv = "cgv_city_79";
          break;
        case "14fc8842-f4cf-483c-91d4-d077ecdf329e":
          id_cgv = "cgv_city_85";
          break;
        case "51a915af-fdf5-4d51-a3f9-0f663447178f":
          id_cgv = "cgv_city_105";
          break;
        case "4ce68594-e383-4a62-9253-4d5dcf172c11":
          id_cgv = "cgv_city_109";
          break;
        case "4ad15300-e8cf-43da-a3ec-34a6aebe2b7e":
          id_cgv = "cgv_city_111";
          break;
        case "2e778031-1887-42b5-a6a9-0976d278b06e":
          id_cgv = "cgv_city_117";
          break;
        case "4f140133-1599-41e9-b307-bbbd697a1dd6":
          id_cgv = "cgv_city_123";
          break;
      }
      insertLocation(location.name, location.id_gal, id_cgv, id_lot, id_bhd);
    });
  });
}

function insertLocation(
  location_name,
  location_id_gal,
  location_id_cgv,
  location_id_lot,
  location_id_bhd
) {
  connection.query(
    "insert into wp_locations(location_name, location_id_gal, location_id_cgv, location_id_lot, location_id_bhd) values(?,?,?,?,?)",
    [
      location_name,
      location_id_gal,
      location_id_cgv,
      location_id_lot,
      location_id_bhd,
    ],
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

function createMovies() {
  connection.query(
    "create table if not exists wp_movies (id int(11) NOT NULL AUTO_INCREMENT, movie_id_gal varchar(255), movie_id_lot varchar(255), movie_id_bhd varchar(255), movie_id_cgv varchar(255), movie_name varchar(255) NOT NULL, is_showing boolean, poster varchar(255), description text, director varchar(255), cast text, running_time varchar(255), trailer varchar(255), age varchar(255), genre varchar(255), release_date varchar(20),  PRIMARY KEY (id))",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

async function getMovies() {
  insertErrorLogs("Getting Movies");
  insertErrorLogs("section start at: " + new Date());
  connection.query(
    "update wp_movies set is_showing = null",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );

  let galMovieSet = new Set();
  let lotMovieSet = new Set();
  let bhdMovieSet = new Set();
  let cgvMovieSet = new Set();
  let galMovie = [];
  let lotMovie = [];
  let bhdMovie = [];
  let cgvMovie = [];

  const buildId = await getBuildId();
  console.log(buildId);

  connection.query(
    "select movie_id_gal, movie_id_lot, movie_id_bhd, movie_id_cgv from wp_movies",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
      results.forEach((movie) => {
        if (movie.movie_id_gal) {
          galMovieSet.add(movie.movie_id_gal);
        }
        if (movie.movie_id_lot) {
          lotMovieSet.add(movie.movie_id_lot);
        }
        if (movie.movie_id_bhd) {
          bhdMovieSet.add(movie.movie_id_bhd);
        }
        if (movie.movie_id_cgv) {
          cgvMovieSet.add(movie.movie_id_cgv);
        }
      });
    }
  );
  try {
    await getGalCommingMovies().then(async (galComming) => {
      galMovie.push(...galComming);
      for (const movie of galComming) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!galMovieSet.has(movie)) {
          try {
            let movieDetails = await getGalMovieDetails(movie, buildId);
            if (movieDetails.movie_name) {
              movieDetails.is_showing = false;
              insertMovie(movieDetails);
            } else {
              insertErrorLogs("ERROR: " + movie + " Details not found");
            }
          } catch (error) {
            insertErrorLogs(error);
          }
          galMovieSet.add(movie);
        } else {
          connection.query(
            "update wp_movies set is_showing = false where movie_id_gal = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
      insertErrorLogs("Get Gal Comming Done");
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  try {
    await delay(5000);
    await getLotCommingMovies().then(async (lotComming) => {
      lotMovie.push(...lotComming);
      for (const movie of lotComming) {
        await delay(1500);
        if (!lotMovieSet.has(movie)) {
          try {
            let movieDetails = await getLotMovieDetails(movie);
            movieDetails.is_showing = false;
            insertMovie(movieDetails);
          } catch (error) {
            insertErrorLogs(error);
          }
          lotMovieSet.add(movie);
        } else {
          connection.query(
            "update wp_movies set is_showing = false where movie_id_lot = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
      insertErrorLogs("Get Lot Comming Done");
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  try {
    await delay(5000);
    await getBhdCommingMovies().then(async (bhdComming) => {
      bhdMovie.push(...bhdComming);

      for (const movie of bhdComming) {
        await delay(1500);
        if (!bhdMovieSet.has(movie)) {
          try {
            let movieDetails = await getBhdMovieDetails(movie);
            movieDetails.is_showing = false;
            insertMovie(movieDetails);
          } catch (error) {
            insertErrorLogs(error);
          }
          bhdMovieSet.add(movie);
        } else {
          connection.query(
            "update wp_movies set is_showing = false where movie_id_bhd = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
      insertErrorLogs("Get BHD Comming Done");
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  try {
    await delay(5000);
    await getCgvComming(browser).then(async (cgvComming) => {
      cgvMovie.push(...cgvComming);
      for (const movie of cgvComming) {
        await delay(1500);
        if (!cgvMovieSet.has(movie)) {
          cgvMovieSet.add(movie);
          if (movie.includes("_") && cgvMovieSet.has(movie.split("_")[0])) {
            connection.query(
              "update wp_movies set movie_id_cgv = ?, is_showing = false where movie_id_cgv = ?",
              [movie, movie.split("_")[0]],
              function (err, results, fields) {
                if (err) {
                  insertErrorLogs(err);
                }
              }
            );
          } else {
            try {
              let movieDetails = await getCgvMovieDetails(browser, movie);
              movieDetails.is_showing = false;
              insertMovie(movieDetails);
            } catch (error) {
              insertErrorLogs(error);
            }
          }
        } else {
          connection.query(
            "update wp_movies set is_showing = false where movie_id_cgv = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
      insertErrorLogs("Get CGV Comming Done");
    });
  } catch (error) {
    insertErrorLogs("Error GET CGV COMMING: " + error);
  }
  try {
    await delay(5000);
    await getLotteShowingMovies().then(async (lotteShowing) => {
      lotMovie.push(...lotteShowing);
      for (const movie of lotteShowing) {
        await delay(1500);
        if (!lotMovieSet.has(movie)) {
          lotMovieSet.add(movie);
          try {
            let movieDetails = await getLotMovieDetails(movie);
            movieDetails.is_showing = true;
            insertMovie(movieDetails);
            insertErrorLogs("Get LOTTE Showing Done");
          } catch (error) {
            insertErrorLogs(error);
          }
        } else {
          connection.query(
            "update wp_movies set is_showing = true where movie_id_lot = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  try {
    await delay(5000);
    await getBhdShowingMovies().then(async (bhdShowing) => {
      bhdMovie.push(...bhdShowing);
      for (const movie of bhdShowing) {
        await delay(1500);
        if (!bhdMovieSet.has(movie)) {
          bhdMovieSet.add(movie);
          try {
            let movieDetails = await getBhdMovieDetails(movie);
            movieDetails.is_showing = true;
            insertMovie(movieDetails);
          } catch (error) {
            insertErrorLogs(error);
          }
        } else {
          connection.query(
            "update wp_movies set is_showing = true where movie_id_bhd = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
      insertErrorLogs("Get BHD Showing Done");
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  try {
    await delay(5000);
    await getCgvShowing(browser).then(async (cgvShowing) => {
      cgvMovie.push(...cgvShowing);
      for (const movie of cgvShowing) {
        await delay(1500);
        if (!cgvMovieSet.has(movie)) {
          cgvMovieSet.add(movie);
          if (movie.includes("_") && cgvMovieSet.has(movie.split("_")[0])) {
            connection.query(
              "update wp_movies set movie_id_cgv = ?, is_showing = true where movie_id_cgv = ?",
              [movie, movie.split("_")[0]],
              function (err, results, fields) {
                if (err) {
                  insertErrorLogs(err);
                }
              }
            );
          } else {
            try {
              let movieDetails = await getCgvMovieDetails(browser, movie);
              movieDetails.is_showing = true;
              insertMovie(movieDetails);
            } catch (error) {
              insertErrorLogs(error);
            }
          }
        } else {
          connection.query(
            "update wp_movies set is_showing = true where movie_id_cgv = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }
      insertErrorLogs("Get CGV Showing Done");
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  try {
    await delay(5000);
    await getGalShowingMovies().then(async (galShowing) => {
      galMovie.push(...galShowing);
      for (const movie of galShowing) {
        await delay(2500);
        if (!galMovieSet.has(movie)) {
          galMovieSet.add(movie);
          try {
            let movieDetails = await getGalMovieDetails(movie, buildId);
            if (movieDetails.movie_name) {
              movieDetails.is_showing = true;
              insertMovie(movieDetails);
            } else {
              insertErrorLogs("ERROR: " + movie + " Details not found");
            }
          } catch (error) {
            insertErrorLogs(error);
          }
        } else {
          connection.query(
            "update wp_movies set is_showing = true where movie_id_gal = ?",
            [movie],
            function (err, results, fields) {
              if (err) {
                insertErrorLogs(err);
              }
            }
          );
        }
      }

      insertErrorLogs("Get GAL Showing Done");
    });
  } catch (error) {
    insertErrorLogs(error);
  }
  // try {
  //   await updateShowtimes();
  // } catch (error) {
  //   insertErrorLogs(error);
  // }
  // remove duplicate movies in each set
  // galMovieSet = [...new Set(galMovieSet)];
  // lotMovieSet = [...new Set(lotMovieSet)];
  // bhdMovieSet = [...new Set(bhdMovieSet)];
  // cgvMovieSet = [...new Set(cgvMovieSet)];

  // await newShowtimes(galMovieSet, lotMovieSet, bhdMovieSet, cgvMovieSet);

  // remove duplicate in movie
  galMovie = [...new Set(galMovie)];
  lotMovie = [...new Set(lotMovie)];
  bhdMovie = [...new Set(bhdMovie)];
  cgvMovie = [...new Set(cgvMovie)];

  await newShowtimes(galMovie, lotMovie, bhdMovie, cgvMovie);

  insertErrorLogs("Get Movies Done");
  insertErrorLogs("section end at: " + new Date());
}
async function newShowtimes(galMovie, lotMovie, bhdMovie, cgvMovie) {
  insertErrorLogs("Updating Showtimes");

  connection.query("delete from wp_showtimes", function (err, results, fields) {
    if (err) {
      insertErrorLogs(err);
    }
    insertErrorLogs("Deleted old showtimes");
  });
  await delay(3000);

  await newGalShowtimes();
  await delay(3000);
  await newBhdShowtimes(bhdMovie);
  await delay(3000);
  await newLotShowtimes();
  await delay(3000);
  await newCgvShowtimes(cgvMovie);
  await delay(3000);
}

async function newGalShowtimes() {
  await getGalShowtimes().then(async (showtimes) => {
    await delay(1000);
    for (const showtime of showtimes) {
      await delay(100);
      insertShowtimes(showtime);
    }
    insertErrorLogs("Inserted Galaxy Showtimes");
  });
}

async function newBhdShowtimes(bhdMovieSet) {
  await delay(3000);
  let session = "";
  try {
    session = await getSession(bhdMovieSet[0]);
  } catch (error) {
    insertErrorLogs(error);
  }
  for (const movie of bhdMovieSet) {
    if (session == "" || session == null) {
      try {
        session = await getSession(movie);
      } catch (error) {
        insertErrorLogs(error);
      }
    }
    for (let date of getCommingDate(7)) {
      date = "" + date;
      await delay(1000);
      try {
        await bhdGetShowtimes(movie, date, session).then(async (showtimes) => {
          for (const showtime of showtimes) {
            await delay(100);
            insertShowtimes(showtime);
          }
        });
      } catch (error) {
        insertErrorLogs(error);
      }
    }
  }
  insertErrorLogs("Inserted BHD Showtimes");
}
async function newLotShowtimes() {
  await new Promise((resolve, reject) => {
    connection.query(
      "select cinema_id from wp_cinema where cinemas_id = 'LOT'",
      async function (err, results, fields) {
        if (err) {
          insertErrorLogs(err);
        }
        for (const result of results) {
          try {
            for (let date of getCommingDate(7)) {
              await delay(5000);
              await getLotShowtimes(result.cinema_id, date).then(
                async (showtimes) => {
                  await delay(500);
                  for (const showtime of showtimes) {
                    await delay(100);
                    insertShowtimes(showtime);
                  }
                }
              );
            }
          } catch (error) {
            insertErrorLogs(error);
          }
        }
        resolve();
      }
    );
  });
  insertErrorLogs("Inserted Lotte Showtimes");
}
async function newCgvShowtimes(cgvMovieSet) {
  for (const movie of cgvMovieSet) {
    for (let date of getCommingDate(7)) {
      await delay(3000);
      try {
        await getCgvShowtimes(movie, date).then(async (showtimes) => {
          await delay(1500);
          for (const showtime of showtimes) {
            await delay(100);
            insertShowtimes(showtime);
          }
        });
      } catch (error) {
        insertErrorLogs(error);
      }
    }
  }
  insertErrorLogs("Inserted CGV Showtimes");
}

function insertMovie(movieDetails) {
  connection.query(
    "insert into wp_movies(movie_id_gal, movie_id_lot, movie_id_bhd, movie_id_cgv, movie_name, is_showing, poster, description, director, cast, running_time, trailer, age, genre, release_date) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)",
    [
      movieDetails.movie_id_gal,
      movieDetails.movie_id_lot,
      movieDetails.movie_id_bhd,
      movieDetails.movie_id_cgv,
      movieDetails.movie_name,
      movieDetails.is_showing,
      movieDetails.poster,
      movieDetails.description,
      movieDetails.director,
      movieDetails.cast,
      movieDetails.running_time,
      movieDetails.trailer,
      movieDetails.age,
      movieDetails.genre,
      movieDetails.release_date,
    ],
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

function createShowtimes() {
  connection.query(
    "create table if not exists wp_showtimes (id int(11) NOT NULL AUTO_INCREMENT,cinemas_id varchar(255), movie_id varchar(255), cinema_id varchar(255), date varchar(20), start_time varchar(20), movie_format varchar(255), PRIMARY KEY (id))",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

async function updateShowtimes() {
  // remove all old showtimes
  insertErrorLogs("Updating Showtimes");
  await new Promise((resolve, reject) => {
    connection.query(
      "delete from wp_showtimes",
      function (err, results, fields) {
        if (err) {
          insertErrorLogs(err);
        }
        insertErrorLogs("Deleted old showtimes");
        resolve();
      }
    );
  });

  await getGalShowtimes().then(async (showtimes) => {
    await delay(1000);
    for (const showtime of showtimes) {
      await delay(100);
      insertShowtimes(showtime);
    }
    insertErrorLogs("Inserted Galaxy Showtimes");
  });
  await new Promise((resolve, reject) => {
    connection.query(
      "select movie_id_bhd, movie_id_cgv from wp_movies where (movie_id_bhd is not null or movie_id_cgv is not null) AND is_showing is not null",
      async function (err, results, fields) {
        if (err) {
          insertErrorLogs(err);
        }

        await delay(3000);
        let session = "";
        for (const movie of results) {
          await delay(3000);

          if (movie.movie_id_bhd) {
            if (session == "" || session == null) {
              try {
                session = await getSession(movie.movie_id_bhd);
              } catch (error) {
                insertErrorLogs(error);
              }
            }
            for (let date of getCommingDate(7)) {
              date = "" + date;
              await delay(1000);
              try {
                await bhdGetShowtimes(movie.movie_id_bhd, date, session).then(
                  async (showtimes) => {
                    for (const showtime of showtimes) {
                      await delay(200);
                      insertShowtimes(showtime);
                    }
                  }
                );
              } catch (error) {
                insertErrorLogs(error);
              }
            }
          }
          if (movie.movie_id_cgv) {
            for (let date of getCommingDate(7)) {
              date = "" + date;
              await delay(5000);
              try {
                await getCgvShowtimes(movie.movie_id_cgv, date).then(
                  async (showtimes) => {
                    await delay(1500);
                    for (const showtime of showtimes) {
                      await delay(100);
                      insertShowtimes(showtime);
                    }
                  }
                );
              } catch (error) {
                insertErrorLogs(error);
              }
            }
          }
        }
        insertErrorLogs("Inserted BHD and CGV Showtimes");
        resolve();
      }
    );
  });
  await new Promise((resolve, reject) => {
    connection.query(
      "select cinema_id from wp_cinema where cinemas_id = 'LOT'",
      async function (err, results, fields) {
        if (err) {
          insertErrorLogs(err);
        }
        for (const result of results) {
          try {
            for (let date of getCommingDate(7)) {
              await delay(5000);
              await getLotShowtimes(result.cinema_id, date).then(
                async (showtimes) => {
                  await delay(500);
                  for (const showtime of showtimes) {
                    await delay(100);
                    insertShowtimes(showtime);
                  }
                }
              );
            }
          } catch (error) {
            insertErrorLogs(error);
          }
        }
        insertErrorLogs("Inserted Lotte Showtimes");
        resolve();
      }
    );
  });

  insertErrorLogs("Updated Showtimes");
}

function insertShowtimes(showtimes) {
  connection.query(
    "insert into wp_showtimes(cinemas_id, movie_id, cinema_id, date, start_time, movie_format) values(?, ?, ?, ?, ?, ?)",
    [
      showtimes.cinemas_id,
      showtimes.movie_id,
      showtimes.cinema_id,
      showtimes.date,
      showtimes.start_time,
      showtimes.movie_format,
    ],
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

function createErrorLogs() {
  connection.query(
    "create table if not exists wp_error_logs (id int(11) NOT NULL AUTO_INCREMENT, error_message text, error_time datetime, PRIMARY KEY (id))",
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

function insertErrorLogs(error_message) {
  error_message = error_message.toString();
  connection.query(
    "insert into wp_error_logs(error_message, error_time) values(?, ?)",
    [error_message, new Date()],
    function (err, results, fields) {
      if (err) {
        insertErrorLogs(err);
      }
    }
  );
}

startPuppeteer().then(async (browser) => {
  async function run() {
    console.log("Start");
    
    createShowtimes();
    createCinemas();
    createMovies();
    createErrorLogs();
    await delay(5000);
    await createCinema();
    await delay(5000);
    await createLocations();
    await delay(5000);

    await delay(5000);
    await getMovies();
    await delay(5000);
  }
  await run();
  await browser.close();
  console.log("Done");
  
  process.exit(0);
});



