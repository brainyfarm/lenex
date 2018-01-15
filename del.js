var bcypher = require('blockcypher');

var bcapi = new bcypher('btc', 'main', 'c78acc7f28d74036bc91394e18d35c6f');

bcapi.delWallet('user0', function(err, res) {
  console.log(err, res);
});
bcapi.delWallet('user1', function(err, res) {
  console.log(err, res);
});
bcapi.delWallet('user2', function(err, res) {
  console.log(err, res);
});
bcapi.delWallet('user3', function(err, res) {
  console.log(err, res);
});
