const axios = require("axios");
const qs = require("qs");
let data = qs.stringify({
  paramList:
    '{"MethodName":"GetTicketingPage","channelType":"HO","osType":"Firefox","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0","memberOnNo":""}',
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://www.lottecinemavn.com/LCWS/Ticketing/TicketingData.aspx",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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
