function getCommingDate(count) {
  var today = new Date();
  var result = [];
  for (var i = 0; i < count; i++) {
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

function convertDateFormat(date) {
  let year = date.slice(0, 4);
  let month = date.slice(4, 6);
  let day = date.slice(6, 8);
  return `${day}/${month}/${year}`;
}

module.exports = { getCommingDate, convertDateFormat };
