const axios = require("axios");
const qs = require("qs");
let data = qs.stringify({
  paramList:
    '{"MethodName":"GetMovies","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","multiLanguageID":"LL","division":1,"moviePlayYN":"Y","orderType":"1","blockSize":100,"pageNo":1}\n',
});

// non active: moviePlayYN: N

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://www.lottecinemavn.com/LCWS/Movie/MovieData.aspx",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Cookie: "ASP.NET_SessionId=aeex3zh52nvqtpxy0fbefb3e",
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
