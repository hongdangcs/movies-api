const getBhdCinemas = require("./bhd/get-cinemas");

getBhdCinemas().then((data) => {  
  console.log(data);
});