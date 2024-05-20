import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";
import parser from "body-parser";
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));

route.get("/fetch2", checkAuth, (req: Request, res: Response) => {
  res.render("taskone/home");
});

route.post("/fetch2", (req: Request, res: Response) => {
  let jsonData = req.body;
  let search: string = jsonData["query"];
  let perPage: number = 5;
  let page: number = parseInt(req.query.page as string) || 1;
  const offset: number = (page - 1) * perPage;
  let q1: string = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%'`;
  let q: string = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%' LIMIT ?, ?`;

  con.query(q1, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result) => {
      if (err) throw err;
      res.render("taskone/data", { users: result, page, search, len: ans });
    });
  });
});

route.get("/fetch2/:page/:search", checkAuth, (req: Request, res: Response) => {
  let search: string = req.params.search;
  let perPage: number = 5;
  let page: number = parseInt(req.params.page) || 1;
  const offset: number = (page - 1) * perPage;
  let q1: string = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%'`;
  let q: string = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%' LIMIT ?, ?`;

  con.query(q1, (err, ans) => {
    if (err) throw err;
    con.query(q, [offset, perPage], (err, result) => {
      if (err) throw err;
      res.render("taskone/data", { users: result, page, search, len: ans });
    });
  });
});

route.get("/view", checkAuth, (req: Request, res: Response) => {
  res.render("taskone/form2");
});

let fname: string;
let lname: string;
let email: string;
let city: string;
let bg: string;

route.post("/view", (req: Request, res: Response) => {
  let data = JSON.stringify(req.body);

  let jsonData = req.body;

  let fname: string = jsonData["fname"];
  let lname: string = jsonData["lname"];
  let email: string = jsonData["email"];
  let city: string = jsonData["city"];
  let bg: string = jsonData["bg"];

  let opa: string = jsonData["opa"];

  let perPage: number = 20;
  let page: number = parseInt(req.params.page as string) || 1;
  const offset: number = (page - 1) * perPage;

  let q1: string = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa}  city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%'`;
  let q: string = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa}  city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%' LIMIT ?, ?`;

  con.query(q1);
  con.query(q, [offset, perPage], (err, ans) => {
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

route.get("/view/:page/:jsonData", checkAuth, (req: Request, res: Response) => {
  let jsonData: string = req.params.jsonData;
  let data = JSON.parse(jsonData);

  let fname: string = data.fname;
  let lname: string = data.lname;
  let email: string = data.email;
  let city: string = data.city;
  let bg: string = data.bg;
  let opa: string = data.opa;

  let perPage: number = 20;
  let page: number = parseInt(req.params.page) || 1;
  const offset: number = (page - 1) * perPage;

  let q1: string = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa} city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%'`;
  let q: string = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa} city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%' LIMIT ?, ?`;

  con.query(q1);
  con.query(q, [offset, perPage], (err, ans) => {
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

export default route;
