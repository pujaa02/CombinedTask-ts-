import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";

route.get("/att", checkAuth, (req: Request, res: Response) => {
  let m: number, y: number;
  if (req.query.months && req.query.year) {
    m = parseInt(req.query.months as string);
    y = parseInt(req.query.year as string);
  } else {
    m = 12;
    y = 2023;
  }
  const perPage: number = 20;
  const page: number = parseInt(req.query.page as string) || 1;
  const offset: number = (page - 1) * perPage;
  const q: string = `SELECT student_master26.id, student_master26.firstname,
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

route.get("/att/:fd", checkAuth, (req: Request, res: Response) => {
  const field: string = req.params.fd;
  let m: number, y: number;
  if (req.query.months && req.query.year) {
    m = parseInt(req.query.months as string);
    y = parseInt(req.query.year as string);
  } else {
    m = 12;
    y = 2023;
  }
  const perPage: number = 20;
  const page: number = parseInt(req.query.page as string) || 1;
  const offset: number = (page - 1) * perPage;
  const q: string = `SELECT student_master26.id, student_master26.firstname,
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

route.get("/data/:fd", checkAuth, (req: Request, res: Response) => {
  const field: string = req.params.fd;
  let m: number | undefined, y: number | undefined;

  if (req.query.months && req.query.year) {
    m = parseInt(req.query.months as string);
    y = parseInt(req.query.year as string);
  } else {
    m = 12;
    y = 2023;
  }

  const perPage: number = 20;
  const page: number = parseInt(req.query.page as string) || 1;
  const offset: number = (page - 1) * perPage;

  let q: string = `SELECT student_master26.id, student_master26.firstname,
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

export default route;
