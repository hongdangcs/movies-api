const axios = require("axios");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.bhdstar.vn/wp-admin/admin-ajax.php?action=ldapp_order_get_schedule&city=tp-ho-chi-minh&orderDate=17%2F01%2F2024&f=467&nonce=26076a1efc",
  headers: {
    Cookie: "PHPSESSID=3293c59e1afff9020bb36c86b55f3374",
  },
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
