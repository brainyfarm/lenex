var Admin = require('./Model/Admin');
var bcrypt = require('bcrypt');
var randToken = require('rand-token');

var express = require('express');
var router = express.Router();

router.post("/create-admin", function(req, res, next) {
  var body = req.body;
  Admin.create({
    name: body.name,
    password: bcrypt.hashSync(body.password, 10),
    token: randToken.generate(128),
  }, function(err) {
    if (err) next(err);
    else {
      res.redirect('/admin/');
    }
  });
});

router.post("/login", function(req, res, next) {
  var body = req.body;
  Admin.findOne({name: body.name}, "password token", function(err, admin) {
    if (err) next(err);
    else if (admin==null) {
      res.redirect('/admin/Login');
    }
    else if (bcrypt.compareSync(body.password, admin.password)) {
      res.cookie('name', body.name, {path: '/admin', maxAge: 172800000, httpOnly: true});
      res.cookie('token', admin.token, {path: '/admin', maxAge: 172800000, httpOnly: true});
      res.redirect('/admin/a/Dashboard');
    }
    else {
      res.redirect('/admin/Login');
    }
  });
});

router.post("/a/change-password", function(req, res, next) {
  var body = req.body;
  Admin.findOne({name: body.name}, 'password', function(err, admin) {
    if (err) {
      next(err);
      return;
    }
    if (!admin) {
      console.log("?? :D ??");
      return;
    }
    if (bcrypt.compareSync(body.oldpass, admin.password)) {
      var hash = bcrypt.hashSync(body.newpass, 10);
      Admin.update({name: body.name}, { password: hash }, function(err) {
        if (err) next(err);
        else {
          res.redirect('/admin/logout');
        }
      });
    }
  });
});

module.exports = router;
