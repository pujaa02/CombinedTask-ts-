import * as express from "express";
let route = express.Router();
import {Request,Response} from "express";
import checkAuth from "../middlewares/checkauth"
import con from "../models/database"
const { check, validationResult } = require("express-validator");
// import  { check, validationResult }  = require('express-validator');
import parser from "body-parser";
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));
const urlencodedParser = parser.urlencoded({ extended: false });
var get_user = require("../public/js/ajaxinsertupdate/get_user");
var get_emp = require("../public/js/ajaxinsertupdate/get_emp_det");
var edu_det = require("../public/js/ajaxinsertupdate/get_edu_det");
var work_exp = require("../public/js/ajaxinsertupdate/work_exp");
var lan = require("../public/js/ajaxinsertupdate/language");
var techno = require("../public/js/ajaxinsertupdate/techno");
var ref = require("../public/js/ajaxinsertupdate/ref");
var pre = require("../public/js/ajaxinsertupdate/pre");

route.get("/users", checkAuth, get_user);
route.get("/emp", checkAuth, get_emp);
route.get("/edu", checkAuth, edu_det);
route.get("/work", checkAuth, work_exp);
route.get("/lan", checkAuth, lan);
route.get("/tech", checkAuth, techno);
route.get("/ref", checkAuth, ref);
route.get("/pre", checkAuth, pre);

route.get("/inuajax", checkAuth, (req, res) => {
  res.render("ajaxinup/home");
});
route.get("/update", checkAuth, (req, res) => {
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

      res.json(`result id is : ${result.insertId} `);
    });
  }
);
route.get("/update/:id", checkAuth, (req, res) => {
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
    }
    res.json("data updated");
  }
);
route.get("/showupdate", checkAuth, (req, res) => {
  res.send("Data is Succesfully Updated!!");
});

module.exports = route;
