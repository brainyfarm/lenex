var dateformat = require('dateformat');

module.exports.balance = function(bl) {
  return bl.toFixed(5);
};

module.exports.date = function(d) {
  return dateformat(d, "yyyy/m/d, h:MM:ss TT");
}
