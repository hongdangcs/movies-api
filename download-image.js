const fs = require("fs");
const axios = require("axios");
const image_path = require("./config").image_path_save;

async function savePoster(posterUrl, imageName) {
    try {
        const imgPath = image_path + imageName;
        const response = await axios({
            url: posterUrl,
            method: "GET",
            responseType: "stream",
        });
        let writer = fs.createWriteStream(imgPath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } catch (e) {
        console.log("Error saving poster: ", posterUrl);
        return false;
    }

}

module.exports = savePoster;