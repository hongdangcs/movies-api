const axios = require("axios");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.cgv.vn/default/cinox/site/cgv-ho-guom-plaza",
  headers: {
    Cookie:
      "TS01faf9b1=018ea3cddaf5ed3af5fdfbebaf95671d3d34aee470a47b66a24ba3622f5c7fc5785a784f6d34a70c8b97782f906295b727d71d9ca46532236e286a4e947e44a5c934c4b153; frontend=0dps2tk84t1019aajltr1ke107; frontend_cid=e8pTqj3s7YibXvQd; TS015ef8cd=018ea3cdda1f6d34b64f3f3fd7ae289817f8638334e0a88e2797db4cf2fddcb3cfced38162",
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
