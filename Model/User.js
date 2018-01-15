var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcypher = require('blockcypher');
var bcrypt = require('bcrypt');
var async = require('async');
var formatter = require('../formatter');

var UserSchema = new Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
  phone: String,
  countryId: Number,
  level: Number,
  referer: String,
  referers: [String],
  team: {
    type: [String],
    default: [],
  },
  balanceACB: {
    type: Number, 
    default: 0,
  },
  BTCWallet: {
    token: String,
    name: String,
    addresses: [String],
    address: String,
    wif: String,
    private: String,
    public: String,
  },
  ETHAddr: {
    token: String,
    address: String,
    private: String,
    public: String,
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  token: String,
});

 
var getBalParam = {
  unspentOnly: 1,
  includeScript:1,
  includeConfidence: 1,
  before : 1,
  after: 1,
  limit: 1,
  confirmations:1,
  confidence : 1,
  omitWalletAddresses:1,
};

UserSchema.statics.getInfo = function(username, cb) {
  var User = this.model('User');
  User.findOne({username: username},
    "BTCWallet ETHAddr",
    function(err, user) {
      async.parallel([
        function(callback) {
          var api = new bcypher('btc','main','c78acc7f28d74036bc91394e18d35c6f');
          api.getAddrBal(user.BTCWallet.address, getBalParam, callback);
        },
        function(callback) {
          var api = new bcypher('eth','main','c78acc7f28d74036bc91394e18d35c6f');
          api.getAddrBal(user.ETHAddr.address, getBalParam, callback);
        },
      ], function(err, res) {
        if (err) return cb(err);
        User.findOne({username: username},
          'username fullName email countryId phone balanceACB BTCWallet ETHAddr',
          function(err, user) {
            user = JSON.parse(JSON.stringify(user));
            user.balanceACB = formatter.balance(user.balanceACB);
            user.balanceBTC = formatter.balance(res[0].balance);
            user.balanceETH = formatter.balance(res[1].balance);
            cb(err, user);
          }
        );
      });
    }
  );
};

UserSchema.statics.addACB = function(username, amount, rate, callback) {
  var User = this.model('User');
  User.findOne({username: username}, 'referers', function(err, user) {
    if (err || !user) {
      // TODO handle when user is not found
      callback(err);
    } else {
      var addList = [username].concat(user.referers).map(function(name) {
        var res = {username: name, amount: amount};
        amount = amount * rate;
        return res;
      });
      // TODO check if update is success
      // TODO only update if amount > 0
      async.each(addList, function(x, cb) {
        if (x.amount > 0) {
          User.update({username: x.username},
            {$inc: {balanceACB: x.amount}}, function(err) {
              if (err) cb(err);
              else cb();
            });
        } else {
          cb();
        }
      }, function(err) {
        callback(err);
      });
    }
  });
};

UserSchema.statics.getTeam = function(username, callback) {
  var User = this.model('User');
  User.find({referer: username}, 'username balanceACB createAt level', function(err, users) {
    users = users.map(function(user) {
      user = JSON.parse(JSON.stringify(user));
      user.balanceACB = formatter.balance(user.balanceACB);
      user.createAt = formatter.date(user.createAt);
      return user;
    });
    callback(err, {users: users});
  });
};

module.exports = mongoose.model('User', UserSchema);
