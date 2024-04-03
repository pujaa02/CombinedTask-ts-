const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
const { check, validationResult } = require("express-validator");
var con = require("../models/database");
var parser = require("body-parser");
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));
const urlencodedParser = parser.urlencoded({ extended: false });

route.get("/inu", checkAuth, (req, res) => {
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
route.get("/alluser", checkAuth, (req, res) => {
  res.render("forminu/fetchuser");
});
route.get("/normalupdate/:id", checkAuth, async (req, res) => {
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

module.exports = route;
