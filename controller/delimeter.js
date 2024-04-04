const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
var con = require("../models/database");
var parser = require("body-parser");
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));

route.get("/sch", checkAuth, (req, res) => {
  res.render("specialchar/home");
});

route.post("/sch", (req, res) => {
  let fname = [],
    lname = [],
    email = [],
    number = [],
    city = [],
    bg = [];
  let jsonData = req.body;
  // console.log(jsonData.query);
  let search = jsonData["query"];
  // console.log(typeof search);
  // console.log(search);
  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (format.test(`${search}`)) {
    // console.log("matched");
    let str = search.replace(/(?=[$-/:-?{-~!"^_`\[\]])/gi, ",");
    // console.log(str);
    let val = str.split(",");
    // console.log(`str is ${val}`);
    // console.log(val.length);

    for (var i = 0; i < val.length; i++) {
      if (val[i].startsWith("_")) {
        let firstname = val[i].replace("_", "");
        fname.push(firstname);
        // console.log(fname);
      }
      if (val[i].startsWith("^")) {
        let lastname = val[i].replace("^", "");
        lname.push(lastname);
      }
      if (val[i].startsWith("$")) {
        let em = val[i].replace("$", "");
        email.push(em);
      }
      if (val[i].startsWith("!")) {
        let num = val[i].replace("!", "");
        number.push(num);
      }
      if (val[i].startsWith("{")) {
        let cy = val[i].replace("{", "");
        city.push(cy);
      }
      if (val[i].startsWith(":")) {
        let blood = val[i].replace(":", "");
        bg.push(blood);
      }
    }
    let q1 = `select * from student_master26 where `;
    // console.log(fname.length);
    // console.log(fname);
    if (fname.length >= 1) {
      for (let i = 0; i < fname.length; i++) {
        q1 += `firstname like '%${fname[i]}%' or `;
      }
      q1 = q1.slice(0, q1.length - 3) + "and ";
    }
    if (lname.length >= 1) {
      for (let i = 0; i < lname.length; i++) {
        q1 += `lastname like '%${lname[i]}%' or `;
      }
      q1 = q1.slice(0, q1.length - 3) + "and ";
    }
    if (email.length >= 1) {
      for (let i = 0; i < email.length; i++) {
        q1 += `email like '%${email[i]}%' or `;
      }
      q1 = q1.slice(0, q1.length - 3) + "and ";
    }
    if (number.length >= 1) {
      for (let i = 0; i < number.length; i++) {
        q1 += `mobile_number like '%${number[i]}%' or `;
      }
      q1 = q1.slice(0, q1.length - 3) + "and ";
    }
    if (city.length >= 1) {
      for (let i = 0; i < city.length; i++) {
        q1 += `city like '%${city[i]}%' or `;
      }
      q1 = q1.slice(0, q1.length - 3) + "and ";
    }
    if (bg.length >= 1) {
      for (let i = 0; i < bg.length; i++) {
        q1 += `blood_group like '%${bg[i]}%' or `;
      }
      q1 = q1.slice(0, q1.length - 3) + "and ";
    }
    q1 = q1.slice(0, q1.length - 4);
    // console.log(q1);

    con.query(q1, (err, result) => {
      if (err) throw err;
      // console.log(result);
      // result = JSON.stringify(result);
      // console.log(result);
      // res.send("hello");
      res.render("specialchar/data.ejs", { users: result });
    });
  } else {
    res.render("specialchar/home2.ejs");
  }
});

module.exports = route;
