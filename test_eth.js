var bcypher = require('blockcypher');

function CreateETHAddr(name, callback) {
  var ethapi = new bcypher('eth','main','c78acc7f28d74036bc91394e18d35c6f');
  var data = {
    token: 'c78acc7f28d74036bc91394e18d35c6f',
    name: name,
    address: null,
  };
  ethapi.genAddr(data, callback);
};

CreateETHAddr('user0', function(err, res) {
  console.log(err, res);
});
