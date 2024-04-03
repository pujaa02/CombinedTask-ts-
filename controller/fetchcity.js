const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
// var con = require("../models/database");
var get_data = require("../public/js/ajaxcityfetch/get_data");
var get_city = require("../public/js/ajaxcityfetch/get_cities");

route.get("/state", checkAuth, get_data);
route.get("/cities", checkAuth, get_city);

route.get("/fetchcity", checkAuth, (req, res) => {
  res.render("fetchcity/home");
});

module.exports = route;
