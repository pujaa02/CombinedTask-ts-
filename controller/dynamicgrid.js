const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
var con = require("../models/database");
var parser = require("body-parser");
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));

route.get("/fetch2", checkAuth, (req, res) => {
  res.render("taskone/home");
});

route.post("/fetch2", (req, res) => {
  let jsonData = req.body;
 
  let search = jsonData["query"];
 
  let perPage = 5;
  let page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * perPage;
  let q1 = `select * from student_master26 where id like '%${search}%'`;
  let q = `select * from student_master26 where id like '%${search}%' limit ?,?`;
  con.query(q1, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result) => {
      if (err) throw err;
      res.render("taskone/data", { users: result, page, search, len: ans });
    });
  });
});

route.get("/fetch2/:page/:search", checkAuth, (req, res) => {
  let search = req.params.search;
  let perPage = 5;
  let page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * perPage;
  let q1 = `select * from student_master26 where id like '%${search}%'`;
  let q = `select * from student_master26 where id like '%${search}%' limit ?,?`;
  con.query(q1, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result) => {
      if (err) throw err;
      res.render("taskone/data", { users: result, page, search, len: ans });
    });
  });
});

route.get("/view", checkAuth, (req, res) => {
  res.render("taskone/form2");
});

let fname, lname, email, city, bg;

route.post("/view", (req, res) => {
  let data = JSON.stringify(req.body);

  let jsonData = req.body;

  fname = jsonData["fname"];

  lname = jsonData["lname"];
  email = jsonData["email"];
  city = jsonData["city"];
  bg = jsonData["bg"];

  let opa = jsonData["opa"];
 
  let perPage = 20;
  let page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * perPage;
  let q1 = `select * from student_master26 where firstname like '%${fname}%' ${opa} lastname like '%${lname}%' ${opa} email like '%${email}%' ${opa}  city like '%${city}%' ${opa} blood_group like '%${bg}%' ;`;
  let q = `select * from student_master26 where firstname like '%${fname}%' ${opa} lastname like '%${lname}%' ${opa} email like '%${email}%' ${opa}  city like '%${city}%' ${opa} blood_group like '%${bg}%' limit ?,? ;`;
  con.query(q1);
  con.query(q1, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result) => {
      if (err) throw err;
   
      res.render("taskone/data2", {
        users: result,
        page,
        len: ans,
        data,
      });
    });
  });
});

route.get("/view/:page/:jsonData", checkAuth, (req, res) => {
  let jsonData = req.params.jsonData;
  let data = JSON.parse(jsonData);

  fname = data.fname;
  
  lname = data.lname;
  email = data.email;
  city = data.city;
  bg = data.bg;
  let opa = data.opa;

  let perPage = 20;
  let page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * perPage;
  let q1 = `select * from student_master26 where firstname like '%${fname}%' ${opa} lastname like '%${lname}%' ${opa} email like '%${email}%' ${opa}  city like '%${city}%' ${opa} blood_group like '%${bg}%' ;`;
  let q = `select * from student_master26 where firstname like '%${fname}%' ${opa} lastname like '%${lname}%' ${opa} email like '%${email}%' ${opa}  city like '%${city}%' ${opa} blood_group like '%${bg}%' limit ?,? ;`;
  con.query(q1);
  con.query(q1, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result) => {
      if (err) throw err;
  
      res.render("taskone/data2", {
        users: result,
        page,
        len: ans,
        data: jsonData,
      });
    });
  });
});

module.exports = route;
