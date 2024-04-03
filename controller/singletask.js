const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");

route.get("/dynamic_table", checkAuth, (req, res) => {
  res.render("singleTask/dynamic_table");
});

route.get("/kukucube", checkAuth, (req, res) => {
  res.render("singleTask/kukucube");
});

route.get("/tic-tac-toe", checkAuth, (req, res) => {
  res.render("singleTask/tic-tac-toe");
});

route.get("/sorting", checkAuth, (req, res) => {
  res.render("singleTask/sorting");
});
route.get("/events", checkAuth, (req, res) => {
  res.render("singleTask/events");
});
route.get("/job_app", checkAuth, (req, res) => {
  res.render("singleTask/job_application");
});

route.get("/calculator", checkAuth, (req, res) => {
  res.render("singleTask/calculator");
});

route.get("/todolist", checkAuth, (req, res) => {
  res.render("singleTask/todo");
});

module.exports = route;
