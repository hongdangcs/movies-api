const savePoster = require('./download-image');
savePoster("https://cdn.galaxycine.vn/media/2024/3/12/exhuma-500_1710214991225.jpg", "ihello.png" ).then(() => {
    console.log("Done");
}   ).catch((err) => {
    console.log(err);
}   );