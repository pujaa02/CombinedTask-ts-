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
  
  let jsonData = req.body;
  
  let search = jsonData["query"];
  
  let perPage = 20;
  let page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * perPage;
  
  if (search === "") {
    res.send("Please Write Query First");
  } else if (
    search.startsWith("delete") ||
    search.startsWith("update") ||
    search.startsWith("drop")
  ) {
    
    res.send("Please write only select query");
  } else if (search.search("limit") > 1) {
    
    let q = `${search}`;
    con.query(q, [offset, perPage], (err, result, field) => {
      if (err) {
        res.render("taskzero/home2", { error: err });
        
      } else {
        res.render("taskzero/nolimit", { users: result, field: field });
      }
    });
  } else {
    let str = search;
    str = str.replace(";", " Limit ?,? ;");
    let q = `${str}`;
    let q2 = `${search}`;
    
    con.query(q2, (err, ans) => {
      if (err) {
        res.render("taskzero/home2", { error: err });
      
      } else {
        con.query(q, [offset, perPage], (err, result, field) => {
          if (err) {
            res.render("home2", { error: err });
           
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
  
  let page = req.params.page;
  
  let perPage = 20;
  const offset = (page - 1) * perPage;
  let sql = search;
  sql = sql.replace(";", " Limit ?,? ;");
  let q = `${sql}`;
  let q2 = `${search}`;
 
  con.query(q2, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result, field) => {
      if (err) throw err;
    
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
