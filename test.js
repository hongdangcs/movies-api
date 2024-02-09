const getCommingDate = require("./getCommingDate");

function get7DaysFromToday() {
  var today = new Date();
  var result = [];
  for (var i = 0; i < 7; i++) {
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + i);
    tomorrow = formatDate(tomorrow);
    result.push(tomorrow);
  }
  return result;
}

function formatDate(date) {
  var year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  return "" + year + month + day;
}
