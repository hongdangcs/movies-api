const axios = require("axios");
const qs = require("qs");
let data = qs.stringify({
  id: "23025300",
  dy: "20240120",
});

// movie id: id
// date: dy

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://www.cgv.vn/default/cinemas/product/ajaxschedule/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Cookie:
      "TS01faf9b1=018ea3cdda0e3700b657567513458a71eebf92e59bb2b36b0e65cc379f05b16d805b5f70b311f6458b455bb2369be8d230c30025c7cf7f0e0e528f697caa53bf42b2a1ce71; frontend=c2hf6c86q0mg6vp37ujuj77o91; frontend_cid=PaZaXhEaIEHB5dZx; TS015ef8cd=018ea3cdda6b91c9c87058f78acd15476991bc797d9c3370a773a0f8918ada30b523d4012b",
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
