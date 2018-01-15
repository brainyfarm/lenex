var bcypher = require('blockcypher');

function CreateETHWallet (name, callback) {
  var ethcapi = new bcypher('eth','main','c78acc7f28d74036bc91394e18d35c6f');
  var data = {
    token: 'c78acc7f28d74036bc91394e18d35c6f',
    name: name,
    address: null,
  };
  ethcapi.createWallet(data, function(err, res) {
    if (err) return callback(err);
    ethcapi.genAddrWallet(data.name, callback);
  });
};

CreateETHWallet('user0', function(err, res) {
  console.log(err);
  console.log(res);
});


function CreateBTCWallet(name, callback) {
  var bcapi = new bcypher('btc','main','c78acc7f28d74036bc91394e18d35c6f');
  var data = {
    token: 'c78acc7f28d74036bc91394e18d35c6f',
    name: name,
    address: null,
  };
  bcapi.createWallet(data, function(err, res) {
  console.log(err);
  console.log(res);
    if (err) return callback(err);
    bcapi.genAddrWallet(data.name, callback);
  });
};

CreateBTCWallet('user0', function(err, res) {
  console.log(err);
  console.log(res);
});
