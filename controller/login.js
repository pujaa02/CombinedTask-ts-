const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
var con = require("../models/database");
var parser = require("body-parser");
let getdata = require("../public/js/checkdate");
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));
var md5 = require("md5");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

let lastid;
route.get("/getData", getdata);
route.get("/", (req, res) => {
  res.render("frontpage/home");
});
//==========================  insert reg data ========================
route.post("/register/:str", async (req, res) => {
  console.log("this is register post");
  let formData = req.body;
//   console.log(formData);
  let str = req.params.str;
  fname = formData.fname;
  lname = formData.lname;
  email = formData.email;
  let q = `insert into login(fname,lname,email,activatecode,date_time,status)values('${fname}','${lname}','${email}','${str}',CURRENT_TIMESTAMP(),'deactive' )`;
  con.query(q, (err, result1) => {
    // console.log(q);
    if (err) throw err;
    // console.log(result1);
    lastid = result1.insertId;
    res.json("123");
  });
});
// ==============actcode to password page================
route.get("/create_password/:actcode", (req, res) => {
  let active = req.params.actcode;
  res.render("frontpage/password", { active });
});
//===================after insert data ================
route.get("/afterregister/:str", (req, res) => {
  let actcode = req.params.str;
//   console.log(actcode);
  res.render("frontpage/activationpage", { lastid, actcode });
});
//================checktime while update password======================
route.get("/checktime/:actcode", (req, res) => {
  let actcode = req.params.actcode;
//   console.log(actcode);
  let q1 = `select date_time from login where activatecode='${actcode}'`;
  con.query(q1, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      let d1 = new Date();
      let d2 = new Date(result[0].date_time);

    //   console.log(d1.getTime() - d2.getTime());
      var diff = (d1.getTime() - d2.getTime()) / 1000;
      var diffsec = d1.getSeconds() - d2.getSeconds();
      diff /= 60 * 60;
      let final = Math.round(diff);
      let final2 = Math.round(diffsec);
    //   console.log(final, final2);
      if (final2 <= 5 && final2 > 0) {
        res.json("0");
      } else {
        let q2 = `delete from login where activatecode='${actcode}'`;
        con.query(q2, (err, result1) => {
          if (err) throw err;
          console.log(result1);
        });
        res.json("1");
      }
    } else {
      res.json("2");
    }
  });
});

//===============generate salt=============
function genesalt() {
  let length = 4;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const total = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * total));
    counter += 1;
  }
  return result;
}
//===========regtration password set==============
route.post("/successreg/:actcd", (req, res) => {
  let code = req.params.actcd;
//   console.log("code", code);
  let formData = req.body;
//   console.log(formData);

  let pass = formData.pass;

  let salt = genesalt();
  let combine = pass + salt;
//   console.log(combine);
  let finalpass = md5(combine);
//   console.log(finalpass);

  let q4 = `update login set password='${finalpass}', salt='${salt}',status='active' where  activatecode='${code}'`;
  con.query(q4, (err, result1) => {
    // console.log(q4);
    if (err) throw err;
    // console.log(result1);

    res.json("123");
  });
});
//===========regtration password update==============
route.post("/updatepass/:mail", (req, res) => {
  let mail = req.params.mail;
  let formData = req.body;
//   console.log(formData);
//   console.log("mail", mail);
  pass = formData.pass;

  let salt = genesalt();
  let combine = pass + salt;
//   console.log(combine);
  let finalpass = md5(combine);
//   console.log(finalpass);

  let q1 = `update login set password='${finalpass}', salt='${salt}' where email='${mail}'`;
  con.query(q1, (err, result1) => {
    // console.log(q1);
    if (err) throw err;
    // console.log(result1);
    res.json("123");
  });
});
//==============login==================
route.get("/login/", (req, res) => {
  res.render("frontpage/login");
});
// ===================clicked on forget password btn at login page=========================
route.get("/secondpage/:str", (req, res) => {
  res.render("frontpage/password");
});

var token;
route.post("/loginpage", async (req, res) => {
//   console.log("this is login post");
  let formData = req.body;
//   console.log(formData);
  user = formData.user;
  pass = formData.pass;
  let combine;
  let flag = true;
  let q5 = `select email,password,salt from login where email='${user}'`;
  con.query(q5, (err, result) => {
    if (err) throw err;
    // console.log(result);
    if (result[0].email == user) {
      //   console.log(result[0]);
      //   console.log("match");
      combine = pass + result[0].salt;
      let resPassword = md5(combine);
    //   console.log("res", res, "+++++++++++++++++++++++++++++++++");
      //   console.log("pass", result[0].password);
      if (resPassword == result[0].password) {
        // console.log("password is right");
        token = jwt.sign(
          { email: result[0].email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.cookie("token", token);
      } else {
        // console.log("password is wrong");
        flag = false;
      }
    } else {
      flag = false;
    }
    // console.log("flag", flag);
    res.json({ flag, token });
  });
});
route.get("/completelogin", checkAuth, (req, res) => {
  // res.send("login successfully!!");
  res.render("Home");
});
route.get("/redirect/:mail", checkAuth, async (req, res) => {
//   console.log("redirect");
  let mail = req.params.mail;
  let q6 = `select * from login where email='${mail}' `;
  // res.render("password");
  con.query(q6, (err, result1) => {
    if (err) throw err;
    console.log(result1[0]);
    if (result1[0]) {
      res.json("email valid");
      // res.render("password");
    } else {
      res.json("email not valid");
    }
  });
});

module.exports = route;
