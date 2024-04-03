const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");

route.get("/timestamp", checkAuth, (req, res) => {
  res.render("timestamp/home");
});

module.exports = route;
