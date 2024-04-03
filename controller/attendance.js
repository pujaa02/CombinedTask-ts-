const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
var con = require("../models/database");

route.get("/att", checkAuth, (req, res) => {
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

route.get("/att/:fd", checkAuth, (req, res) => {
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

route.get("/data/:fd", checkAuth, (req, res) => {
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

module.exports = route;
