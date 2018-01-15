var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
  res.redirect('/admin/a/Dashboard');
});

router.get("/a/Dashboard", function(req, res, next) {
  res.render('pages/admin/Dashboard');
});

router.get("/a/Settings", function(req, res, next) {
  res.render('pages/admin/Settings');
});

router.get("/Login", function(req, res, next) {
  res.render('pages/admin/Login');
});

router.get("/Signup", function(req, res, next) {
  res.render('pages/admin/Signup');
});


module.exports = router;
