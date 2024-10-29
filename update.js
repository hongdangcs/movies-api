const puppeteer = require("puppeteer");
const mysql = require("mysql2");
const server_configs = require("./config");
if (typeof ReadableStream === 'undefined') {
    global.ReadableStream = require('web-streams-polyfill').ReadableStream;
}
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
const getSession = require("./bhd/get-session");
const getBuildId = require("./gal/get-buildId");

let browser
async function startPuppeteer() {
    browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
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
    await delay(500);
    await newBhdShowtimes(bhdMovie);
    await delay(500);
    await newLotShowtimes();
    await delay(500);
    await newCgvShowtimes(cgvMovie);
    await delay(500);
}

async function newGalShowtimes() {
    await getGalShowtimes().then(async (showtimes) => {
        await delay(500);
        for (const showtime of showtimes) {
            await delay(50);
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
            await delay(500);
            try {
                await bhdGetShowtimes(movie, date, session).then(async (showtimes) => {
                    for (const showtime of showtimes) {
                        await delay(50);
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
                            await delay(500);
                            await getLotShowtimes(result.cinema_id, date).then(
                                async (showtimes) => {
                                    await delay(500);
                                    for (const showtime of showtimes) {
                                        await delay(50);
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
            await delay(500);
            try {
                await getCgvShowtimes(movie, date).then(async (showtimes) => {
                    await delay(200);
                    for (const showtime of showtimes) {
                        await delay(50);
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

startPuppeteer().then(async () => {
    async function run() {
        console.log("Start");

        await delay(2000);
        await getMovies();
        await delay(3000);
    }
    await run();
    await browser.close();
    console.log("Done");

    process.exit(0);
});