const server_configs = require("./config")
const mysql = require("mysql2");
const savePoster = require("./download-image");


const connection = mysql.createConnection({
    host: server_configs.db.database_host_name,
    user: server_configs.db.database_user_name,
    database: server_configs.db.database_name,
    password: server_configs.db.database_password,
  });

async function connectToDatabase() {
    try {
        await connection.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

 connection.query("select * from wp_movies",
    async function(err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(results.length);
            for (const movie of results) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                let original_image_path = movie.poster;
                let original_image_extension = original_image_path.split(".").pop();

                let image_name = movie.id +"."+ original_image_extension;
                if (image_name === original_image_path) {
                    continue;
                }
                let error = await savePoster(movie.poster, image_name);
                if  (error === false) {
                    console.log("Movie ID error: ", movie.id);
                    image_name = "";
                    console.log(error);
                }


                connection.query("update wp_movies set poster = ? where id = ?", [image_name, movie.id]);
            }
        }   
    }
);