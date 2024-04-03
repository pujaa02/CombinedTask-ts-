const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");

route.get("/frame1", checkAuth, (req, res) => {
  res.render("frame1/f1");
});
route.get("/frame2", checkAuth, (req, res) => {
  res.render("frame2/f2");
});
route.get("/frame3", checkAuth, (req, res) => {
  res.render("frame3/f3");
});

module.exports = route;
