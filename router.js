const route = require("express").Router();
const { check, validationResult } = require("express-validator");
var get_data = require("./ajaxcityfetch/get_data");
var get_city = require("./ajaxcityfetch/get_cities");
var get_user = require("./ajaxinsertupdate/get_user");
var get_emp = require("./ajaxinsertupdate/get_emp_det");
var edu_det = require("./ajaxinsertupdate/get_edu_det");
var work_exp = require("./ajaxinsertupdate/work_exp");
var lan = require("./ajaxinsertupdate/language");
var techno = require("./ajaxinsertupdate/techno");
var ref = require("./ajaxinsertupdate/ref");
var pre = require("./ajaxinsertupdate/pre");
var checkAuth = require("./checkauth");
var md5 = require("md5");
var mysql = require("mysql2");
var parser = require("body-parser");
const cookieParser = require("cookie-parser");
let getdata = require("./checkdate");
// const { response } = require("express");
route.use(cookieParser());
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));
const urlencodedParser = parser.urlencoded({ extended: false });
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@258",
  database: "main",
  dateStrings: "true",
});
con.connect((err) => {
  if (err) throw err;
  console.log("connected!!");
});

let lastid;
route.get("/getData", getdata);
route.get("/", (req, res) => {
  res.render("frontpage/home");
});
//==============insert reg data==========
route.post("/register/:str", async (req, res) => {
  console.log("this is register post");
  let formData = req.body;
  console.log(formData);
  let str = req.params.str;
  fname = formData.fname;
  lname = formData.lname;
  email = formData.email;
  let q = `insert into login(fname,lname,email,activatecode,date_time,status)values('${fname}','${lname}','${email}','${str}',CURRENT_TIMESTAMP(),'deactive' )`;
  con.query(q, (err, result1) => {
    console.log(q);
    if (err) throw err;
    console.log(result1);
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
  console.log(actcode);
  res.render("frontpage/activationpage", { lastid, actcode });
});
//================checktime while update password======================
route.get("/checktime/:actcode", (req, res) => {
  let actcode = req.params.actcode;
  console.log(actcode);
  let q1 = `select date_time from login where activatecode='${actcode}'`;
  con.query(q1, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      let d1 = new Date();
      let d2 = new Date(result[0].date_time);

      console.log(d1.getTime() - d2.getTime());
      var diff = (d1.getTime() - d2.getTime()) / 1000;
      var diffsec = d1.getSeconds() - d2.getSeconds();
      diff /= 60 * 60;
      let final = Math.round(diff);
      let final2 = Math.round(diffsec);
      console.log(final, final2);
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
  console.log("code", code);
  let formData = req.body;
  console.log(formData);

  let pass = formData.pass;

  let salt = genesalt();
  let combine = pass + salt;
  console.log(combine);
  let finalpass = md5(combine);
  console.log(finalpass);

  let q4 = `update login set password='${finalpass}', salt='${salt}',status='active' where  activatecode='${code}'`;
  con.query(q4, (err, result1) => {
    console.log(q4);
    if (err) throw err;
    console.log(result1);

    res.json("123");
  });
});
//===========regtration password update==============
route.post("/updatepass/:mail", (req, res) => {
  let mail = req.params.mail;
  let formData = req.body;
  console.log(formData);
  console.log("mail", mail);
  pass = formData.pass;

  let salt = genesalt();
  let combine = pass + salt;
  console.log(combine);
  let finalpass = md5(combine);
  console.log(finalpass);

  let q1 = `update login set password='${finalpass}', salt='${salt}' where email='${mail}'`;
  con.query(q1, (err, result1) => {
    console.log(q1);
    if (err) throw err;
    console.log(result1);
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
  console.log("this is login post");
  let formData = req.body;
  console.log(formData);
  user = formData.user;
  pass = formData.pass;
  let combine;
  let flag = true;
  let q5 = `select email,password,salt from login where email='${user}'`;
  con.query(q5, (err, result) => {
    if (err) throw err;
    if (result[0].email == user) {
      console.log(result[0]);
      console.log("match");
      combine = pass + result[0].salt;
      let res = md5(combine);
      console.log("res", res);
      console.log("pass", result[0].password);
      if (res == result[0].password) {
        console.log("password is right");
        token = jwt.sign(
          { email: result[0].email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
      } else {
        console.log("password is wrong");
        flag = false;
      }
    } else {
      flag = false;
    }
    console.log("flag", flag);
    res.json({ flag, token });
  });
});
route.get("/completelogin", checkAuth, (req, res) => {
  // res.send("login successfully!!");
  res.render("Home");
});
route.get("/redirect/:mail", async (req, res) => {
  console.log("redirect");
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

//======================================= home========================
// route.get("/home", (req, res) => {
//   res.render("Home");
// });
route.get("/dynamic_table", (req, res) => {
  res.render("singleTask/dynamic_table");
});

route.get("/kukucube", (req, res) => {
  res.render("singleTask/kukucube");
});

route.get("/tic-tac-toe", (req, res) => {
  res.render("singleTask/tic-tac-toe");
});

route.get("/sorting", (req, res) => {
  res.render("singleTask/sorting");
});
route.get("/events", (req, res) => {
  res.render("singleTask/events");
});
route.get("/job_app", (req, res) => {
  res.render("singleTask/job_application");
});
// ================ order by =====================
var name;
route.get("/data", (req, res) => {
  if (req.query.field) {
    name = req.query.field;
  } else {
    name = "id";
  }
  const perPage = 200; // Number of items per page
  let page = parseInt(req.query.page) || 1; // Current page number

  // Calculate offset
  const offset = (page - 1) * perPage;
  //offset= (perPage * page) - perPage

  // Fetch data for current page
  con.query(
    `SELECT * FROM student_master26 order by ${name} LIMIT ?, ?`,
    [offset, perPage],
    (error, results) => {
      if (error) throw error;

      // Fetch total count of data for pagination
      con.query("SELECT COUNT(*) AS count FROM student_master26", (error) => {
        // console.log(page);
        if (error) throw error;
        res.render("order/orderpagination26", {
          users: results,
          page: page,
          field: req.query.field,
        });
      });
    }
  );
});
//==================attendeanch27==================
route.get("/att", (req, res) => {
  let m, y;
  if ((req.query.months, req.query.year)) {
    m = req.query.months;
    y = req.query.year;
  } else {
    m = 12;
    y = 2023;
  }
  let perPage = 20;
  let page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * perPage;
  let q = `SELECT student_master26.id, student_master26.firstname,
  YEAR(att_master26.date) AS year, 
  MONTH(att_master26.date) AS month, 
  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/30),2 )as Percentage  FROM student_master26 
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where YEAR(att_master26.date)=${y} and MONTH(att_master26.date)=${m} GROUP BY year, month,student_master26.id LIMIT ?, ?`;
  con.query(q, [offset, perPage], (err, result) => {
    if (err) throw err;
    res.render("atten/Attendance(27)", { users: result, page });
  });
});

route.get("/att/:fd", (req, res) => {
  let field = req.params.fd;
  let m, y;
  if ((req.query.months, req.query.year)) {
    m = req.query.months;
    y = req.query.year;
  } else {
    m = 12;
    y = 2023;
  }
  // let order = desc;
  let perPage = 20;
  let page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * perPage;
  let q = `SELECT student_master26.id, student_master26.firstname,
  YEAR(att_master26.date) AS year, 
  MONTH(att_master26.date) AS month, 
  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/30),2 )as Percentage  FROM student_master26 
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where YEAR(att_master26.date)=${y} and MONTH(att_master26.date)=${m} GROUP BY year, month,student_master26.id order by ${field} desc LIMIT ?, ?`;
  con.query(q, [offset, perPage], (err, result) => {
    if (err) throw err;
    res.render("atten/Attendance(27)", { users: result, page });
  });
});

route.get("/data/:fd", (req, res) => {
  let field = req.params.fd;
  let m, y;
  if ((req.query.months, req.query.year)) {
    m = req.query.months;
    y = req.query.year;
  } else {
    m = 12;
    y = 2023;
  }
  // let order = desc;
  let perPage = 20;
  let page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * perPage;
  let q = `SELECT student_master26.id, student_master26.firstname,
  YEAR(att_master26.date) AS year, 
  MONTH(att_master26.date) AS month, 
  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/30),2 )as Percentage  FROM student_master26 
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where YEAR(att_master26.date)=${y} and MONTH(att_master26.date)=${m} GROUP BY year, month,student_master26.id order by ${field} LIMIT ?, ?`;
  con.query(q, [offset, perPage], (err, result) => {
    if (err) throw err;
    res.render("atten/Attendance(27)", { users: result, page });
  });
});

// =========================result=======================
route.get("/result", (req, res) => {
  let q1 = `select student_master26.id, student_master26.firstname,sum(exam_result.theory_obtain_mark) as Theory,sum(exam_result.prac_total_mark) as Practical from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id where exam_result.exam_id=1 group by student_master26.id;`;
  let q2 = `select sum(exam_result.theory_obtain_mark) as Th2,sum(exam_result.prac_total_mark) as Prac2 from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id where exam_result.exam_id=2 group by student_master26.id`;
  let q3 = `select sum(exam_result.theory_obtain_mark) as Th3,sum(exam_result.prac_total_mark) as Prac3 from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id where exam_result.exam_id=3 group by student_master26.id;`;
  let q4 = ` select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id group by student_master26.id;`;
  let q5 = `  SELECT  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT,
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
 INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id  GROUP BY student_master26.id ; `;

  con.query(q1, (err, result1) => {
    if (err) throw err;
    // console.log(result1);
    con.query(q2, (err, result2) => {
      if (err) throw err;
      // console.log(result2);
      con.query(q3, (err, result3) => {
        if (err) throw err;
        // console.log(result3, field);
        console.log(result3[3]);
        con.query(q4, (err, result4) => {
          if (err) throw err;
          // console.log(result4);
          con.query(q5, (err, result5) => {
            if (err) throw err;
            // console.log(result5);
            res.render("result/result27", {
              users: result1,
              user2: result2,
              user3: result3,
              user4: result4,
              user5: result5,
            });
          });
        });
      });
    });
  });
});

route.get("/datares/:id", (req, res) => {
  let id = req.params.id;
  let q1 = `select student_master26.id, student_master26.firstname,count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT,
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
 INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where student_master26.id=${id}  GROUP BY student_master26.id ;`;
  let q2 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=1 ;`;
  let q3 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=2 ;`;
  let q4 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=3 ;`;
  let q5 = `select sub_id,student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id group by student_master26.id,sub_id;`;
  let q6 = `  select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id  where student_master26.id=${id};`;
  let q7 = `select sub_name from subject_master;`;
  //  con.query(q1, (err, result1) => {
  con.query(q1, (err, ans1) => {
    if (err) throw err;
    // console.log(ans1);
    con.query(q2, (err, ans2) => {
      if (err) throw err;
      // console.log(ans2);
      con.query(q3, (err, ans3) => {
        if (err) throw err;
        // console.log(ans3);
        con.query(q4, (err, ans4) => {
          if (err) throw err;
          // console.log(ans4);
          con.query(q5, (err, ans5) => {
            if (err) throw err;
            // console.log(ans5);
            con.query(q6, (err, ans6) => {
              if (err) throw err;
              // console.log("Answer 6:", ans6);
              con.query(q7, (err, ans7) => {
                if (err) throw err;
                // console.log(ans6);
                res.render("result/data27", {
                  key1: ans1,
                  key2: ans2,
                  key3: ans3,
                  key4: ans4,
                  key5: ans5,
                  key6: ans6,
                  key7: ans7,
                });
              });
            });
          });
        });
      });
    });
  });
});

// ====================fetch data using query=============

// route.get("/fetch", (req, res) => {
//   res.render("taskzero/home");
// });
// route.post("/fetch", async function (req, res) {
//   console.log("post");
//   // const search = JSON.stringify(req.body);
//   let jsonData = req.body;
//   console.log(jsonData);
//   let search = jsonData["query"];
//   console.log(search);
//   let perPage = 20;
//   let page = parseInt(req.query.page) || 1;
//   const offset = (page - 1) * perPage;
//   console.log(search.search("limit"));
//   if (search === "") {
//     res.send("Please Write Query First");
//   } else if (search.search("limit") > 1) {
//     // console.log("else if");
//     let q = `${search}`;
//     con.query(q, [offset, perPage], (err, result, field) => {
//       if (err) throw err;
//       res.render("nolimit", { users: result, field: field });
//     });
//   } else {
//     let str = search;
//     str = str.replace(";", " Limit ?,? ;");
//     let q = `${str}`;
//     let q2 = `${search}`;
//     // console.log("query", q);
//     // console.log("str", str);
//     con.query(q2, (err, ans) => {
//       if (err) throw err;
//       con.query(q, [offset, perPage], (err, result, field) => {
//         if (err) throw err;
//         // console.log(result.length);
//         // console.log(field.length);
//         // console.log(field[0]["name"]);
//         res.render("taskzero/data", {
//           users: result,
//           field: field,
//           page,
//           search,
//           len: ans,
//         });
//       });
//     });
//   }
// });
// route.get("/fetchdata/:page/:query", async function (req, res) {
//   let search = req.params.query;
//   // console.log(sql);
//   let page = req.params.page;
//   // console.log(page);
//   let perPage = 20;
//   const offset = (page - 1) * perPage;
//   let sql = search;
//   sql = sql.replace(";", " Limit ?,? ;");
//   let q = `${sql}`;
//   let q2 = `${search}`;
//   // console.log("query", q);
//   // console.log("str", sql);
//   con.query(q2, (err, ans) => {
//     if (err) throw err;
//     con.query(q, [offset, perPage], (err, result, field) => {
//       if (err) throw err;
//       // console.log("result length :" + result.length);
//       res.render("taskzero/data", {
//         users: result,
//         field: field,
//         search,
//         page,
//         len: ans,
//       });
//     });
//   });
// });

// ====================fetch data using query//22////=============

route.get("/fetch2", (req, res) => {
  res.render("taskone/home");
});

route.post("/fetch2", (req, res) => {
  let jsonData = req.body;
  console.log(jsonData);
  let search = jsonData["query"];
  console.log(search);
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

route.get("/fetch2/:page/:search", (req, res) => {
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

route.get("/view", (req, res) => {
  res.render("taskone/form2");
});

let fname, lname, email, city, bg;

route.post("/view", (req, res) => {
  let data = JSON.stringify(req.body);
  console.log(`data is : ${data}`);
  let jsonData = req.body;
  console.log(jsonData);
  fname = jsonData["fname"];
  console.log(fname);
  lname = jsonData["lname"];
  email = jsonData["email"];
  city = jsonData["city"];
  bg = jsonData["bg"];
  let opa = jsonData["opa"];
  console.log(opa);
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
      console.log("ans.length/20 : ");
      console.log(ans.length / 20);
      res.render("taskone/data2", {
        users: result,
        page,
        len: ans,
        data,
      });
    });
  });
});

route.get("/view/:page/:jsonData", (req, res) => {
  console.log(`we are at pagination`);
  let jsonData = req.params.jsonData;
  let data = JSON.parse(jsonData);
  console.log(`In paging page : jsondata is : `);
  console.log(data);
  fname = data.fname;
  // console.log(fname);
  lname = data.lname;
  email = data.email;
  city = data.city;
  bg = data.bg;
  let opa = data.opa;
  // console.log(opa);
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
      // console.log(result);
      res.render("taskone/data2", {
        users: result,
        page,
        len: ans,
        data: jsonData,
      });
    });
  });
});

//===========fetching by special character==============
route.get("/sch", (req, res) => {
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
  // console.log(search);
  let str = search.replace(/(?=[$-/:-?{-~!"^_`\[\]])/gi, ",");
  console.log(str);
  let val = str.split(",");
  // console.log(`str is ${val}`);
  // console.log(val.length);

  for (var i = 0; i < val.length; i++) {
    if (val[i].startsWith("_")) {
      let firstname = val[i].replace("_", "");
      fname.push(firstname);
      console.log(fname);
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
      bodyParser.push(blood);
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
});

// =====================generate form========
route.get("/geneform", (req, res) => {
  res.render("generateform/home");
});

route.post("/geneform", (req, res) => {
  let jsonData = req.body;
  //   let search = jsonData["query"];
  let search = jsonData.query;
  let type = jsonData.type;
  console.log(search);
  let q = `select selection_master.sel_id,selection_master.type,option_master.op_name from selection_master
  join option_master on selection_master.sel_id=option_master.sel_id 
 where selection_master.sel_name="${search}";`;
  con.query(q, (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log(result[0].type);
    console.log(result.length);
    res.render("generateform/data.ejs", { users: result, search, type });
  });
});

// ===================form insert & update ===========

route.get("/inu", (req, res) => {
  res.render("forminu/home");
});

route.post(
  "/inu",
  urlencodedParser,
  [
    check("fname", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("lname", "This lastname must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("designa", "This designation must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("dob", "Enter date-of-birth in yyyy-mm-dd formate").isDate(),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("number", "Please enter valid Mobile Number").isMobilePhone(),
    check("zipcode", "zipcode length should be 6 characters").isLength({
      min: 6,
      max: 6,
    }),
    check("add1", "address1 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
    check("add2", "address2 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
  ],
  (req, res) => {
    let id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("forminu/home", {
        alert,
      });
    }
    let jsondata = req.body;

    console.log(jsondata);

    fname = req.body.fname;
    lname = req.body.lname;
    designation = req.body.designa;
    email = req.body.email;
    phone = req.body.number;
    gender = req.body.gender;
    rel_status = req.body.relstatus;
    address1 = req.body.add1;
    address2 = req.body.add2;
    city = req.body.city;
    state = req.body.state;
    zipcode = req.body.zipcode;
    bd = req.body.dob;

    let edu = ["ssc", "hsc", "bachelor", "master"];

    let lan1 = ["", "", ""];
    let lan2 = ["", "", ""];
    let lan3 = ["", "", ""];

    lan1[1] = req.body.lan1;
    if (req.body.able1) {
      console.log("enter1");
      lan1[2] = req.body.able1.toString();
    }

    lan2[1] = req.body.lan2;
    if (req.body.able2) {
      console.log("enter2========");
      lan2[2] = req.body.able2.toString();
    }
    lan3[1] = req.body.lan3;
    if (req.body.able3) {
      console.log("enter3========");
      lan3[2] = req.body.able3.toString();
    }
    // console.log(basic_detail);

    let tech1 = ["", "", ""];
    let tech2 = ["", "", ""];
    let tech3 = ["", "", ""];
    let tech4 = ["", "", ""];

    tech1[1] = req.body.tech1;
    tech1[2] = req.body.level1;

    tech2[1] = req.body.tech2;
    tech2[2] = req.body.level2;

    tech3[1] = req.body.tech3;
    tech3[2] = req.body.level3;

    tech4[1] = req.body.tech4;
    tech4[2] = req.body.level4;

    let ref1 = ["", "", "", ""];
    let ref2 = ["", "", "", ""];
    let ref3 = ["", "", "", ""];

    ref1[1] = req.body.name1;
    ref1[2] = req.body.mobileno1;
    ref1[3] = req.body.rel1;

    ref2[1] = req.body.name2;
    ref2[2] = req.body.mobileno2;
    ref2[3] = req.body.rel2;

    ref3[1] = req.body.name3;
    ref3[2] = req.body.mobileno3;
    ref3[3] = req.body.rel3;

    let pre = ["", "", "", "", "", ""];

    pre[1] = req.body.preloc;
    pre[2] = req.body.notice;
    pre[3] = req.body.exctc;
    pre[4] = req.body.curctc;
    pre[5] = req.body.depa;

    let q = `insert into emp_details(fname,lname,designation,email,phone,gender,rel_status,address1,address2,city,state,zipcode, bd) values ("${fname}","${lname}","${designation}","${email}","${phone}","${gender}","${rel_status}","${address1}","${address2}","${city}","${state}","${zipcode}","${bd}") `;
    console.log(q);
    con.query(q, (err, result) => {
      // console.log(q);
      if (err) throw err;
      console.log("result is : ");
      console.log(result.insertId);
      id = result.insertId;
      console.log(id);

      let len = req.body.board_name;
      for (let i = 0; i < len.length; i++) {
        let q1 = `insert into edu_detail( emp_id,
            type_of_result,
            Name_of_board_or_course,
            Passing_year,
            Percentage) values('${id}','${edu[i]}','${req.body.board_name[i]}','${req.body.py[i]}','${req.body.percentage[i]}');`;
        if (req.body.board_name[i]) {
          con.query(q1, (err, result1) => {
            console.log(q1);
            if (err) throw err;
            console.log("result is : ");
            console.log(result1);
          });
        }
      }

      let wklen = req.body.companyname;
      for (let i = 0; i < wklen.length; i++) {
        let q2 = `insert into work_experience( emp_id,
            company_name ,designation ,from_date, to_date) values('${id}','${req.body.companyname[i]}','${req.body.designation[i]}','${req.body.from[i]}','${req.body.to[i]}');`;
        if (req.body.companyname[i]) {
          con.query(q2, (err, result1) => {
            console.log(q2);
            if (err) throw err;
            console.log("result is : ");
            console.log(result1);
          });
        }
      }

      let q3 = `insert into language(emp_id ,
        language_know,
       rws) values(?)`;

      if (req.body.lan1) {
        lan1[0] = id;
        con.query(q3, [lan1], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      if (req.body.lan2) {
        lan2[0] = id;
        con.query(q3, [lan2], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      if (req.body.lan3) {
        lan3[0] = id;
        con.query(q3, [lan3], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }

      let q4 = `insert into know_techno(emp_id,tech_know ,level_of_technology) values( ? )`;
      tech1[0] = id;
      if (req.body.tech1) {
        con.query(q4, [tech1], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      tech2[0] = id;
      if (req.body.tech2) {
        con.query(q4, [tech2], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      tech3[0] = id;
      if (req.body.tech3) {
        con.query(q4, [tech3], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      tech4[0] = id;
      if (req.body.tech4) {
        con.query(q4, [tech4], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      //section ref
      let reflen = req.body.name;
      for (let i = 0; i < reflen.length; i++) {
        let q5 = `insert into reference_contact(emp_id, name ,
            contact_number ,relation) values('${id}','${req.body.name[i]}','${req.body.mobileno[i]}','${req.body.rel[i]}');`;
        if (req.body.name[i]) {
          con.query(q5, (err, result1) => {
            console.log(q5);
            if (err) throw err;
            console.log("result is : ");
            console.log(result1);
          });
        }
      }
      //section ended

      let q6 = `insert into preferences(emp_id, prefered_location,
          notice_period , expected_ctc,current_ctc , department) values( ? )`;
      pre[0] = id;
      con.query(q6, [pre], (err, result) => {
        if (err) throw err;
        console.log("result is : ");
        console.log(result);
      });
      // res.render("show");
      // res.send(`result id is : ${result.insertId} `);
      res.render("forminu/fetchuser");
    });
  }
);
route.get("/alluser", (req, res) => {
  res.render("forminu/fetchuser");
});
route.get("/normalupdate/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);

  if (req.params.id) {
    let query = (str) => {
      return new Promise((resolve, reject) => {
        con.query(str, (err, result) => {
          if (err) throw err;
          else {
            resolve(result);
          }
        });
      });
    };

    let count = await query(
      `select count(*) as lt from edu_detail where emp_id=${id};`
    );
    if (count[0].lt >= 1) {
      let result = await query(`select * from emp_details where emp_id=${id};`);
      // console.log(result);
      let result1 = await query(`select * from edu_detail where emp_id=${id};`);
      let result2 = await query(
        `select * from work_experience where emp_id=${id};`
      );
      let result3 = await query(`select * from language where emp_id=${id};`);
      let result4 = await query(
        `select * from know_techno where emp_id=${id};`
      );
      let result5 = await query(
        `select * from reference_contact where emp_id=${id};`
      );
      let result6 = await query(
        `select * from preferences where emp_id=${id};`
      );
      let tech = [];
      let techlevel = [];
      for (let i = 0; i < result4.length; i++) {
        techlevel.push(result4[i].tech_know + result4[i].level_of_technology);
        tech.push(result4[i].tech_know);
      }
      let lan = [];
      for (let i = 0; i < result3.length; i++) {
        lan.push(result3[i].language_know);
      }
      let arr1 = [];
      let arr2 = [];
      let arr3 = [];

      if (result3[0]) {
        let str = result3[0].rws;
        arr1 = str.split(",");
      }
      if (result3[1]) {
        let str = result3[1].rws;
        arr2 = str.split(",");
      }
      if (result3[2]) {
        let str = result3[2].rws;
        arr3 = str.split(",");
      }
      // console.log(arr1, arr2, arr3);
      // arr3.indexOf("speak") >= 0 ? console.log("hello") : console.log("nice");
      res.render("forminu/update", {
        id,
        result,
        result1,
        result2,
        result3,
        result4,
        tech,
        techlevel,
        lan,
        arr1,
        arr2,
        arr3,
        result5,
        result6,
      });
    }
  }
});

route.post(
  "/normalupdate/:id",
  urlencodedParser,
  [
    check("fname", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("lname", "This lastname must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("designa", "This designation must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("dob", "Enter date-of-birth in yyyy-mm-dd formate").isDate(),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("number", "Please enter valid Mobile Number").isMobilePhone(),
    check("zipcode", "zipcode length should be 6 characters").isLength({
      min: 6,
      max: 6,
    }),
    check("add1", "address1 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
    check("add2", "address2 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
  ],
  async (req, res) => {
    let id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("forminu/home", {
        alert,
      });
    }
    let jsondata = req.body;

    console.log(jsondata);

    if (req.params.id) {
      let query = (str) => {
        return new Promise((resolve, reject) => {
          con.query(str, (err, result) => {
            console.log(str);
            if (err) throw err;
            else {
              console.log(str);
              resolve(result);
            }
          });
        });
      };
      // =========section1===============
      fname = req.body.fname;
      lname = req.body.lname;
      designation = req.body.designa;
      email = req.body.email;
      phone = req.body.number;
      gender = req.body.gender;
      rel_status = req.body.relstatus;
      address1 = req.body.add1;
      address2 = req.body.add2;
      city = req.body.city;
      state = req.body.state;
      zipcode = req.body.zipcode;
      bd = req.body.dob;
      let emp_detail = await query(
        `UPDATE emp_details
        SET fname='${fname}', lname='${lname}',designation='${designation}',email='${email}',phone='${phone}',gender='${gender}',
        rel_status='${rel_status}',address1='${address1}',address2='${address2}',city='${city}',
        state='${state}',zipcode='${zipcode}',bd='${bd}'
        WHERE emp_id='${id}';`
      );
      // console.log(emp_detail);
      //==========section2=============
      let edu = ["ssc", "hsc", "bachelor", "master"];
      let len = req.body.board_name;
      let arr6 = await query(
        `select edu_id as edu_id from edu_detail where emp_id in(${id});`
      );
      console.log("arr6", arr6.length);
      for (let i = 0; i < len.length; i++) {
        console.log(i);
        if (arr6[i]) {
          let edu_detail = await query(`UPDATE edu_detail
        SET Name_of_board_or_course='${req.body.board_name[i]}',Passing_year='${req.body.py[i]}',Percentage='${req.body.percentage[i]}'
        WHERE emp_id='${id}' and type_of_result='${edu[i]}' and edu_id='${arr6[i].edu_id}';`);
          // console.log(edu_detail);
        } else {
          if (len[i]) {
            let inser_edu = await query(`insert into edu_detail( emp_id,
            type_of_result,
            Name_of_board_or_course,
            Passing_year,
            Percentage) values('${id}','${edu[i]}','${req.body.board_name[i]}','${req.body.py[i]}','${req.body.percentage[i]}');`);
          }
        }
      }
      //============section3============
      let arr = await query(
        `select id as work_id from emp.work_experience where emp_id in(${id});`
      );
      console.log(arr);
      // console.log(arr[0].work_id);

      let wklen = req.body.companyname;
      for (let i = 0; i < wklen.length; i++) {
        if (arr[i]) {
          let work_exp = await query(`UPDATE work_experience
            SET company_name='${req.body.companyname[i]}',designation='${req.body.designation[i]}',from_date='${req.body.from[i]}',to_date='${req.body.to[i]}'
            WHERE emp_id='${id}' and id='${arr[i].work_id}';`);
        } else {
          if (wklen[i]) {
            let work_ins = await query(`insert into work_experience( emp_id,
          company_name ,designation ,from_date, to_date) values('${id}','${req.body.companyname[i]}','${req.body.designation[i]}','${req.body.from[i]}','${req.body.to[i]}');`);
          }
        }
      }

      //language

      let languagearr = [];
      let rwsarr = [];
      if (req.body.lan1) {
        languagearr.push(req.body.lan1);
        rwsarr.push(req.body.able1);
      }
      if (req.body.lan2) {
        languagearr.push(req.body.lan2);
        rwsarr.push(req.body.able2);
      }
      if (req.body.lan3) {
        languagearr.push(req.body.lan3);
        rwsarr.push(req.body.able3);
      }
      let del = await query(`delete from language where emp_id='${id}';`);
      for (let i = 0; i < languagearr.length; i++) {
        let lan_edit = await query(`insert into language(emp_id ,
            language_know,
           rws) values('${id}','${languagearr[i]}','${rwsarr[i]}')`);
      }

      let tech = [];
      let level = [];
      if (req.body.tech1) {
        tech.push(req.body.tech1);
        level.push(req.body.level1);
      }
      if (req.body.tech2) {
        tech.push(req.body.tech2);
        level.push(req.body.level2);
      }
      if (req.body.tech3) {
        tech.push(req.body.tech3);
        level.push(req.body.level3);
      }
      if (req.body.tech4) {
        tech.push(req.body.tech4);
        level.push(req.body.level4);
      }
      let arr5 = await query(
        `select id as tech_id from emp.know_techno where emp_id in(${id});`
      );
      console.log(arr5[0]);
      for (let i = 0; i < tech.length; i++) {
        if (arr5[i]) {
          let tech_edit = await query(`UPDATE know_techno set
                 tech_know='${tech[i]}',
                 level_of_technology= '${level[i]}'
                  where emp_id='${id}' and id='${arr5[i].tech_id}';`);
        } else {
          if (tech[i]) {
            let insert_tech = await query(
              `insert into know_techno(emp_id,tech_know ,level_of_technology) values('${id}','${tech[i]}','${level[i]}')`
            );
          }
        }
      }
      //section ref
      let arr2 = await query(
        `select ref_id as ref_id from reference_contact where emp_id in(${id});`
      );
      let reflen = req.body.name;
      for (let i = 0; i < reflen.length; i++) {
        if (arr2[i]) {
          let work_exep = await query(`UPDATE reference_contact
          SET name='${req.body.name[i]}',contact_number='${req.body.mobileno[i]}',relation='${req.body.rel[i]}'
          WHERE emp_id='${id}' and ref_id='${arr2[i].ref_id}';`);
        } else {
          if (reflen[i]) {
            let ins_workexp =
              await query(`insert into reference_contact(emp_id, name ,
            contact_number ,relation) values('${id}','${req.body.name[i]}','${req.body.mobileno[i]}','${req.body.rel[i]}');`);
          }
        }
      }

      //section ended
      let pref = await query(
        `UPDATE preferences
      SET prefered_location='${req.body.preloc}', notice_period='${req.body.notice}',expected_ctc='${req.body.exctc}',current_ctc='${req.body.curctc}',department='${req.body.depa}'
      WHERE emp_id='${id}';`
      );
      //end
    }
    res.send(`data is succesfully updated `);
  }
);

// ====================ajax city & country===================

route.get("/state", get_data);
route.get("/cities", get_city);

route.get("/fetchcity", (req, res) => {
  res.render("fetchcity/home");
});

// ====================inu using ajax===================

route.get("/users", get_user);
route.get("/emp", get_emp);
route.get("/edu", edu_det);
route.get("/work", work_exp);
route.get("/lan", lan);
route.get("/tech", techno);
route.get("/ref", ref);
route.get("/pre", pre);

route.get("/inuajax", (req, res) => {
  res.render("ajaxinup/home");
});
route.get("/update", (req, res) => {
  res.render("ajaxinup/fetchuser");
});

route.post(
  "/submit",
  urlencodedParser,
  [
    check("fname", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("lname", "This lastname must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("designa", "This designation must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("dob", "Enter date-of-birth in yyyy-mm-dd formate").isDate(),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("number", "Please enter valid Mobile Number").isMobilePhone(),
    check("zipcode", "zipcode length should be 6 characters").isLength({
      min: 6,
      max: 6,
    }),
    check("add1", "address1 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
    check("add2", "address2 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
  ],
  (req, res) => {
    console.log("this is update post");
    let formData = req.body;
    console.log(formData);
    let id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("ajaxinup/home", {
        alert,
      });
    }

    fname = formData.fname;
    lname = formData.lname;
    designation = formData.designa;
    email = formData.email;
    phone = formData.number;
    gender = formData.gender;
    rel_status = formData.relstatus;
    address1 = formData.add1;
    address2 = formData.add2;
    city = formData.city;
    state = formData.state;
    zipcode = formData.zipcode;
    bd = formData.dob;
    let edu = ["ssc", "hsc", "bachelor", "master"];
    let lan1 = ["", "", ""];
    let lan2 = ["", "", ""];
    let lan3 = ["", "", ""];
    lan1[1] = formData.lan1;
    if (formData.able1) {
      console.log("enter1");
      lan1[2] = formData.able1.toString();
    }
    lan2[1] = formData.lan2;
    if (formData.able2) {
      console.log("enter2========");
      lan2[2] = formData.able2.toString();
    }
    lan3[1] = formData.lan3;
    if (formData.able3) {
      console.log("enter3========");
      lan3[2] = formData.able3.toString();
    }
    // console.log(basic_detail);
    let tech1 = ["", "", ""];
    let tech2 = ["", "", ""];
    let tech3 = ["", "", ""];
    let tech4 = ["", "", ""];
    tech1[1] = formData.tech1;
    tech1[2] = formData.level1;
    tech2[1] = formData.tech2;
    tech2[2] = formData.level2;
    tech3[1] = formData.tech3;
    tech3[2] = formData.level3;
    tech4[1] = formData.tech4;
    tech4[2] = formData.level4;
    let ref1 = ["", "", "", ""];
    let ref2 = ["", "", "", ""];
    let ref3 = ["", "", "", ""];
    ref1[1] = formData.name1;
    ref1[2] = formData.mobileno1;
    ref1[3] = formData.rel1;
    ref2[1] = formData.name2;
    ref2[2] = formData.mobileno2;
    ref2[3] = formData.rel2;
    ref3[1] = formData.name3;
    ref3[2] = formData.mobileno3;
    ref3[3] = formData.rel3;
    let pre = ["", "", "", "", "", ""];
    pre[1] = formData.preloc;
    pre[2] = formData.notice;
    pre[3] = formData.exctc;
    pre[4] = formData.curctc;
    pre[5] = formData.depa;
    let q = `insert into
    emp_details(fname,lname,designation,email,phone,gender,rel_status,address1,address2,city,state,zipcode, bd) values
    ("${fname}","${lname}","${designation}","${email}","${phone}","${gender}","${rel_status}","${address1}","${address2}","${city}","${state}","${zipcode}","${bd}") `;
    console.log(q);
    con.query(q, (err, result) => {
      // console.log(q);
      if (err) throw err;
      console.log("result is : ");
      console.log(result.insertId);
      id = result.insertId;
      console.log(id);
      let len = formData.board_name;
      for (let i = 0; i < len.length; i++) {
        let q1 = `insert into edu_detail( emp_id,type_of_result,Name_of_board_or_course,Passing_year,Percentage)values('${id}','${edu[i]}','${formData.board_name[i]}','${formData.py[i]}','${formData.percentage[i]}');`;
        if (formData.board_name[i]) {
          con.query(q1, (err, result1) => {
            console.log(q1);
            if (err) throw err;
            console.log("result is : ");
            console.log(result1);
          });
        }
      }
      let wklen = formData.companyname;
      for (let i = 0; i < wklen.length; i++) {
        let q2 = `insert into work_experience( emp_id,company_name ,designation ,from_date, to_date)
    values('${id}','${formData.companyname[i]}','${formData.designation[i]}','${formData.from[i]}','${formData.to[i]}');`;
        if (formData.companyname[i]) {
          con.query(q2, (err, result1) => {
            console.log(q2);
            if (err) throw err;
            console.log("result is : ");
            console.log(result1);
          });
        }
      }
      let q3 = `insert into language(emp_id ,language_know,rws) values(?)`;
      if (formData.lan1) {
        lan1[0] = id;
        con.query(q3, [lan1], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      if (formData.lan2) {
        lan2[0] = id;
        con.query(q3, [lan2], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      if (formData.lan3) {
        lan3[0] = id;
        con.query(q3, [lan3], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      let q4 = `insert into know_techno(emp_id,tech_know ,level_of_technology) values( ? )`;
      tech1[0] = id;
      if (formData.tech1) {
        con.query(q4, [tech1], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      tech2[0] = id;
      if (formData.tech2) {
        con.query(q4, [tech2], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      tech3[0] = id;
      if (formData.tech3) {
        con.query(q4, [tech3], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      tech4[0] = id;
      if (formData.tech4) {
        con.query(q4, [tech4], (err, result) => {
          if (err) throw err;
          console.log("result is : ");
          console.log(result);
        });
      }
      //section ref
      let reflen = formData.name;
      for (let i = 0; i < reflen.length; i++) {
        let q5 = `insert into reference_contact(emp_id, name ,contact_number ,relation) values('${id}','${formData.name[i]}','${formData.mobileno[i]}','${formData.rel[i]}');`;
        if (formData.name[i]) {
          con.query(q5, (err, result1) => {
            console.log(q5);
            if (err) throw err;
            console.log("result is : ");
            console.log(result1);
          });
        }
      }
      //section ended
      let q6 = `insert into preferences(emp_id, prefered_location,notice_period , expected_ctc,current_ctc , department) values( ? )`;
      pre[0] = id;
      con.query(q6, [pre], (err, result) => {
        if (err) throw err;
        console.log("result is : ");
        console.log(result);
      });
      // res.render("show");
      res.json(`result id is : ${result.insertId} `);
    });
  }
);
route.get("/update/:id", (req, res) => {
  let id = req.params.id;
  res.render("ajaxinup/home", { id });
});
route.post(
  "/update/:id",
  urlencodedParser,
  [
    check("fname", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("lname", "This lastname must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("designa", "This designation must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("dob", "Enter date-of-birth in yyyy-mm-dd formate").isDate(),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("number", "Please enter valid Mobile Number").isMobilePhone(),
    check("zipcode", "zipcode length should be 6 characters").isLength({
      min: 6,
      max: 6,
    }),
    check("add1", "address1 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
    check("add2", "address2 length should be 6 to 45 characters").isLength({
      min: 6,
      max: 45,
    }),
  ],
  async (req, res) => {
    let id = req.params.id;
    console.log(id);
    console.log("this is update post");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("ajaxinup/home", {
        alert,
      });
    }
    let formData = req.body;
    console.log(formData);
    if (req.params.id) {
      let query = (str) => {
        return new Promise((resolve, reject) => {
          con.query(str, (err, result) => {
            console.log(str);
            if (err) throw err;
            else {
              resolve(result);
            }
          });
        });
      };
      // =========section1===============
      fname = formData.fname;
      lname = formData.lname;
      designation = formData.designa;
      email = formData.email;
      phone = formData.number;
      gender = formData.gender;
      rel_status = formData.relstatus;
      address1 = formData.add1;
      address2 = formData.add2;
      city = formData.city;
      state = formData.state;
      zipcode = formData.zipcode;
      bd = formData.dob;
      let emp_detail = await query(
        `UPDATE emp_details
          SET fname='${fname}', lname='${lname}',designation='${designation}',email='${email}',phone='${phone}',gender='${gender}',
          rel_status='${rel_status}',address1='${address1}',address2='${address2}',city='${city}',
          state='${state}',zipcode='${zipcode}',bd='${bd}'
          WHERE emp_id='${id}';`
      );
      // console.log(emp_detail);
      //   //==========section2=============
      let edu = ["ssc", "hsc", "bachelor", "master"];
      let len = formData.board_name;
      let arr6 = await query(
        `select edu_id as edu_id from edu_detail where emp_id in(${id});`
      );
      console.log(arr6);
      console.log(len.length);
      for (let i = 0; i < len.length; i++) {
        console.log(i);
        if (arr6[i]) {
          let edu_detail = await query(`UPDATE edu_detail
          SET Name_of_board_or_course='${formData.board_name[i]}',Passing_year='${formData.py[i]}',Percentage='${formData.percentage[i]}'
          WHERE emp_id='${id}' and type_of_result='${edu[i]}' and edu_id='${arr6[i].edu_id}';`);
          // console.log(edu_detail);
        } else {
          if (len[i]) {
            let inser_edu = await query(`insert into edu_detail( emp_id,
                type_of_result,
                Name_of_board_or_course,
                Passing_year,
                Percentage) values('${id}','${edu[i]}','${formData.board_name[i]}','${formData.py[i]}','${formData.percentage[i]}');`);
          }
        }
      }
      //   //============section3============
      let arr = await query(
        `select id as work_id from emp.work_experience where emp_id in(${id});`
      );
      console.log(arr);
      // console.log(arr[0].work_id);

      let wklen = formData.companyname;
      for (let i = 0; i < wklen.length; i++) {
        if (arr[i]) {
          let work_exp = await query(`UPDATE work_experience
              SET company_name='${formData.companyname[i]}',designation='${formData.designation[i]}',from_date='${formData.from[i]}',to_date='${formData.to[i]}'
              WHERE emp_id='${id}' and id='${arr[i].work_id}';`);
        } else {
          if (wklen[i]) {
            let work_ins = await query(`insert into work_experience( emp_id,
              company_name ,designation ,from_date, to_date) values('${id}','${formData.companyname[i]}','${formData.designation[i]}','${formData.from[i]}','${formData.to[i]}');`);
          }
        }
      }

      //   //language

      let languagearr = [];
      let rwsarr = [];
      if (formData.lan1) {
        languagearr.push(formData.lan1);
        rwsarr.push(formData.able1);
      }
      if (formData.lan2) {
        languagearr.push(formData.lan2);
        rwsarr.push(formData.able2);
      }
      if (formData.lan3) {
        languagearr.push(formData.lan3);
        rwsarr.push(formData.able3);
      }
      let del = await query(`delete from language where emp_id='${id}';`);
      for (let i = 0; i < languagearr.length; i++) {
        let lan_edit = await query(`insert into language(emp_id ,
              language_know,
             rws) values('${id}','${languagearr[i]}','${rwsarr[i]}')`);
      }

      //   //techno

      let tech = [];
      let level = [];
      if (formData.tech1) {
        tech.push(formData.tech1);
        level.push(formData.level1);
      }
      if (formData.tech2) {
        tech.push(formData.tech2);
        level.push(formData.level2);
      }
      if (formData.tech3) {
        tech.push(formData.tech3);
        level.push(formData.level3);
      }
      if (formData.tech4) {
        tech.push(formData.tech4);
        level.push(formData.level4);
      }
      let arr5 = await query(
        `select id as tech_id from emp.know_techno where emp_id in(${id});`
      );
      console.log(arr5[0]);
      for (let i = 0; i < tech.length; i++) {
        if (arr5[i]) {
          let tech_edit = await query(`UPDATE know_techno set
                   tech_know='${tech[i]}',
                   level_of_technology= '${level[i]}'
                    where emp_id='${id}' and id='${arr5[i].tech_id}';`);
        } else {
          if (tech[i]) {
            let insert_tech = await query(
              `insert into know_techno(emp_id,tech_know ,level_of_technology) values('${id}','${tech[i]}','${level[i]}')`
            );
          }
        }
      }
      //   //section ref
      let arr2 = await query(
        `select ref_id as ref_id from reference_contact where emp_id in(${id});`
      );
      let reflen = formData.name;
      for (let i = 0; i < reflen.length; i++) {
        if (arr2[i]) {
          let work_exep = await query(`UPDATE reference_contact
            SET name='${formData.name[i]}',contact_number='${formData.mobileno[i]}',relation='${formData.rel[i]}'
            WHERE emp_id='${id}' and ref_id='${arr2[i].ref_id}';`);
        } else {
          if (reflen[i]) {
            let ins_workexp =
              await query(`insert into reference_contact(emp_id, name ,
                contact_number ,relation) values('${id}','${formData.name[i]}','${formData.mobileno[i]}','${formData.rel[i]}');`);
          }
        }
      }

      //   //section ended
      let pref = await query(
        `UPDATE preferences
        SET prefered_location='${formData.preloc}', notice_period='${formData.notice}',expected_ctc='${formData.exctc}',current_ctc='${formData.curctc}',department='${formData.depa}'
        WHERE emp_id='${id}';`
      );
      //   //end
    }
    res.json("data updated");
  }
);
route.get("/showupdate", (req, res) => {
  res.send("Data is Succesfully Updated!!");
});

// ===========timestamp=================

route.get("/timestamp", (req, res) => {
  res.render("timestamp/home");
});

module.exports = route;
