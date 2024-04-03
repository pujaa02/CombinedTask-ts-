const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
var con = require("../models/database");
var parser = require("body-parser");
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));

route.get("/fetch", checkAuth, (req, res) => {
  res.render("taskzero/home");
});
route.post("/fetch", async function (req, res) {
  console.log("post");
  // const search = JSON.stringify(req.body);
  let jsonData = req.body;
  console.log(jsonData);
  let search = jsonData["query"];
  console.log("search", search);
  let perPage = 20;
  let page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * perPage;
  console.log(search.search("limit"));
  // console.log("check", search.startsWith("delete"));
  if (search === "") {
    res.send("Please Write Query First");
  } else if (
    search.startsWith("delete") ||
    search.startsWith("update") ||
    search.startsWith("drop")
  ) {
    // console.log("enter");
    res.send("Please write only select query");
  } else if (search.search("limit") > 1) {
    // console.log("else if");
    let q = `${search}`;
    con.query(q, [offset, perPage], (err, result, field) => {
      if (err) {
        res.render("taskzero/home2", { error: err });
        // res.json(err);
      } else {
        res.render("taskzero/nolimit", { users: result, field: field });
      }
    });
  } else {
    let str = search;
    str = str.replace(";", " Limit ?,? ;");
    let q = `${str}`;
    let q2 = `${search}`;
    // console.log("query", q);
    // console.log("str", str);
    con.query(q2, (err, ans) => {
      if (err) {
        res.render("taskzero/home2", { error: err });
        // res.json(err);
      } else {
        con.query(q, [offset, perPage], (err, result, field) => {
          if (err) {
            res.render("home2", { error: err });
            // res.json(err);
          } else {
            res.render("taskzero/data", {
              users: result,
              field: field,
              page,
              search,
              len: ans,
            });
          }
        });
      }
    });
  }
});
route.get("/fetchdata/:page/:query", checkAuth, async function (req, res) {
  let search = req.params.query;
  // console.log(sql);
  let page = req.params.page;
  // console.log(page);
  let perPage = 20;
  const offset = (page - 1) * perPage;
  let sql = search;
  sql = sql.replace(";", " Limit ?,? ;");
  let q = `${sql}`;
  let q2 = `${search}`;
  // console.log("query", q);
  // console.log("str", sql);
  con.query(q2, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result, field) => {
      if (err) throw err;
      // console.log("result length :" + result.length);
      res.render("taskzero/data", {
        users: result,
        field: field,
        search,
        page,
        len: ans,
      });
    });
  });
});

module.exports = route;
