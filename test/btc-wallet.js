var bcypher = require('blockcypher');

function CreateBTCWallet(name, callback) {
  var bcapi = new bcypher('btc','main','c78acc7f28d74036bc91394e18d35c6f');
  bcapi.delWallet(name, function(err) {
    var data = {
      token: 'c78acc7f28d74036bc91394e18d35c6f',
      name: name,
      address: null,
    };
    bcapi.createWallet(data, function(err, res) {
      if (err) return callback(err);
      if (res.error) return callback(res.error);
      bcapi.genAddrWallet(data.name, callback);
    });
  });
};
