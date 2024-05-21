import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";
import parser from "body-parser";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import getdata from "./checkdate"
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));
// import {Md5} from 'ts-md5';
var md5 = require("md5");
import { ResultSetHeader, RowDataPacket } from "mysql2";
dotenv.config();


let lastid: number;
route.get("/getData", getdata);
route.get("/", (req: Request, res: Response) => {
  res.render("frontpage/home");
});
//==========================  insert reg data ========================
route.post("/register/:str", async (req: Request, res: Response) => {
  let formData = req.body;

  let str = req.params.str;
  let fname: string = formData.fname;
  let lname: string = formData.lname;
  let email: string = formData.email;

  let q = `insert into login(fname,lname,email,activatecode,date_time,status) values('${fname}','${lname}','${email}','${str}',CURRENT_TIMESTAMP(),'deactive')`;

  con.query(q, (err: any | null, result1?: any) => {
    if (err) throw err;

    lastid = result1.insertId;
    res.json("123");
  });
});
// ==============actcode to password page================
route.get("/create_password/:actcode", (req: Request, res: Response) => {
  let active = req.params.actcode;
  res.render("frontpage/password", { active });
});
//===================after insert data ================
route.get("/afterregister/:str", (req: Request, res: Response) => {
  let actcode = req.params.str;

  res.render("frontpage/activationpage", { lastid, actcode });
});
//================checktime while update password======================
route.get("/checktime/:actcode",async (req: Request, res: Response) => {
  let actcode = req.params.actcode;
  let q1 = `select date_time from login where activatecode='${actcode}'`;
  
  con.query(q1 , (err: any | null, result?: any) => {
    if (err) throw err;

    if (result.length > 0) {
      let d1 = new Date();
      let d2 = new Date(result[0].date_time);

      var diff = (d1.getTime() - d2.getTime()) / 1000;
      var diffsec = d1.getSeconds() - d2.getSeconds();
      diff /= 60 * 60;
      let final = Math.round(diff);
      let final2 = Math.round(diffsec);

      if (final2 <= 50 && final2 > 0) {
        res.json("0");
      } else {
        let q2 = `delete from login where activatecode='${actcode}'`;
        con.query(q2, (err, result1) => {
          if (err) throw err;
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
route.post("/successreg/:actcd", (req: Request, res: Response) => {
  let code: string = req.params.actcd;

  let formData: any = req.body;

  let pass: string = formData.pass;

  let salt: string = genesalt(); // Assuming genesalt() is defined elsewhere
  let combine: string = pass + salt;

  let finalpass = md5(combine); // Assuming Md5() is defined elsewhere

  let q4: string = `update login set password='${finalpass}', salt='${salt}',status='active' where  activatecode='${code}'`;
  con.query(q4, (err, result1) => {
    if (err) throw err;

    res.json("123");
  });
});
//===========regtration password update==============
route.post("/updatepass/:mail", (req: Request, res: Response) => {
  let mail: string = req.params.mail;
  let formData: any = req.body;

  let pass: string = formData.pass;

  let salt:string = genesalt();
  let combine :string= pass + salt;
  
  let finalpass = md5(combine);
 // Assuming Md5() is defined elsewhere

  let q1: string = `update login set password='${finalpass}', salt='${salt}' where email='${mail}'`;
  con.query(q1, (err, result1) => {
    if (err) throw err;

    res.json("123");
  });
});
//==============login==================
route.get("/login/", (req: Request, res: Response) => {
  res.render("frontpage/login");
});
// ===================clicked on forget password btn at login page=========================
route.get("/secondpage/:str", (req: Request, res: Response) => {
  res.render("frontpage/password");
});

let token: string;

route.post("/loginpage", async (req: Request, res: Response) => {
  let formData: any = req.body;

  let user: string = formData.user;
  let pass: string = formData.pass;
  let combine: string;
  let flag: boolean = true;

  let q5: string = `select email,password,salt from login where email='${user}'`;
  con.query(q5, (err: any | null, result?: any) => {
    if (err) throw err;

    if (result.length > 0 && result[0].email === user) {
      combine = pass + result[0].salt;
      let resPassword = md5(combine);

      if (resPassword === result[0].password) {
        token = jwt.sign(
          { email: result[0].email },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1h" }
        );
        res.cookie("token", token);
      } else {
        flag = false;
      }
    } else {
      flag = false;
    }

    res.json({ flag, token });
  });
});
route.get("/completelogin", checkAuth, (req: Request, res: Response) => {
  res.render("Home");
});
route.get("/redirect/:mail", checkAuth, async (req: Request, res: Response) => {
  let mail: string = req.params.mail;
  let q6: string = `select * from login where email='${mail}' `;

  con.query(q6, (err: any | null, result1?: any) => {
    if (err) throw err;
    console.log(result1[0]);
    if (result1.length > 0) {
      res.json("email valid");
    } else {
      res.json("email not valid");
    }
  });
});

export default route;
