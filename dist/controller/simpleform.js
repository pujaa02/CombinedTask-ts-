"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
let route = express.Router();
const checkauth_1 = __importDefault(require("../middlewares/checkauth"));
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../models/database"));
const body_parser_1 = __importDefault(require("body-parser"));
route.use(body_parser_1.default.json());
route.use(body_parser_1.default.urlencoded({ extended: false }));
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
route.get("/inu", checkauth_1.default, (req, res) => {
    res.render("forminu/home");
});
route.post("/inu", urlencodedParser, [
    (0, express_validator_1.check)("fname", "This username must be 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("lname", "This lastname must be 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("designa", "This designation must be 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("dob", "Enter date-of-birth in yyyy-mm-dd format").isDate(),
    (0, express_validator_1.check)("email", "Email is not valid").isEmail().normalizeEmail(),
    // check("number", "Please enter a valid Mobile Number").isMobilePhone(),
    (0, express_validator_1.check)("zipcode", "zipcode length should be 6 characters").isLength({
        min: 6,
        max: 6,
    }),
    (0, express_validator_1.check)("add1", "address1 length should be 6 to 45 characters").isLength({
        min: 6,
        max: 45,
    }),
    (0, express_validator_1.check)("add2", "address2 length should be 6 to 45 characters").isLength({
        min: 6,
        max: 45,
    }),
], (req, res) => {
    let id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render("forminu/home", {
            alert,
        });
    }
    let jsondata = req.body;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let designation = req.body.designa;
    let email = req.body.email;
    let phone = req.body.number;
    let gender = req.body.gender;
    let rel_status = req.body.relstatus;
    let address1 = req.body.add1;
    let address2 = req.body.add2;
    let city = req.body.city;
    let state = req.body.state;
    let zipcode = req.body.zipcode;
    let bd = req.body.dob;
    let edu = ["ssc", "hsc", "bachelor", "master"];
    let lan1 = ["", "", ""];
    let lan2 = ["", "", ""];
    let lan3 = ["", "", ""];
    lan1[1] = req.body.lan1;
    if (req.body.able1) {
        lan1[2] = req.body.able1.toString();
    }
    lan2[1] = req.body.lan2;
    if (req.body.able2) {
        lan2[2] = req.body.able2.toString();
    }
    lan3[1] = req.body.lan3;
    if (req.body.able3) {
        lan3[2] = req.body.able3.toString();
    }
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
    let q = `INSERT INTO emp_details(fname, lname, designation, email, phone, gender, rel_status, address1, address2, city, state, zipcode, bd) VALUES ("${fname}", "${lname}", "${designation}", "${email}", "${phone}", "${gender}", "${rel_status}", "${address1}", "${address2}", "${city}", "${state}", "${zipcode}", "${bd}")`;
    database_1.default.query(q, (err, result) => {
        if (err)
            throw err;
        id = result.insertId;
        let len = req.body.board_name;
        for (let i = 0; i < len.length; i++) {
            let q1 = `INSERT INTO edu_detail(emp_id, type_of_result, Name_of_board_or_course, Passing_year, Percentage) VALUES ('${id}', '${edu[i]}', '${req.body.board_name[i]}', '${req.body.py[i]}', '${req.body.percentage[i]}')`;
            if (req.body.board_name[i]) {
                database_1.default.query(q1, (err, result1) => {
                    if (err)
                        throw err;
                });
            }
        }
        let wklen = req.body.companyname;
        for (let i = 0; i < wklen.length; i++) {
            let q2 = `INSERT INTO work_experience(emp_id, company_name, designation, from_date, to_date) VALUES ('${id}', '${req.body.companyname[i]}', '${req.body.designation[i]}', '${req.body.from[i]}', '${req.body.to[i]}')`;
            if (req.body.companyname[i]) {
                database_1.default.query(q2, (err, result1) => {
                    if (err)
                        throw err;
                });
            }
        }
        let q3 = `INSERT INTO language(emp_id, language_know, rws) VALUES (?)`;
        if (req.body.lan1) {
            lan1[0] = id;
            database_1.default.query(q3, [lan1], (err, result) => {
                if (err)
                    throw err;
            });
        }
        if (req.body.lan2) {
            lan2[0] = id;
            database_1.default.query(q3, [lan2], (err, result) => {
                if (err)
                    throw err;
            });
        }
        if (req.body.lan3) {
            lan3[0] = id;
            database_1.default.query(q3, [lan3], (err, result) => {
                if (err)
                    throw err;
            });
        }
        let q4 = `INSERT INTO know_techno(emp_id, tech_know, level_of_technology) VALUES (?)`;
        tech1[0] = id;
        if (req.body.tech1) {
            database_1.default.query(q4, [tech1], (err, result) => {
                if (err)
                    throw err;
            });
        }
        tech2[0] = id;
        if (req.body.tech2) {
            database_1.default.query(q4, [tech2], (err, result) => {
                if (err)
                    throw err;
            });
        }
        tech3[0] = id;
        if (req.body.tech3) {
            database_1.default.query(q4, [tech3], (err, result) => {
                if (err)
                    throw err;
            });
        }
        tech4[0] = id;
        if (req.body.tech4) {
            database_1.default.query(q4, [tech4], (err, result) => {
                if (err)
                    throw err;
            });
        }
        //section ref
        let reflen = req.body.name;
        for (let i = 0; i < reflen.length; i++) {
            let q5 = `INSERT INTO reference_contact(emp_id, name, contact_number, relation) VALUES ('${id}', '${req.body.name[i]}', '${req.body.mobileno[i]}', '${req.body.rel[i]}')`;
            if (req.body.name[i]) {
                database_1.default.query(q5, (err, result1) => {
                    if (err)
                        throw err;
                });
            }
        }
        //section ended
        let q6 = `INSERT INTO preferences(emp_id, prefered_location, notice_period, expected_ctc, current_ctc, department) VALUES (?)`;
        pre[0] = id;
        database_1.default.query(q6, [pre], (err, result) => {
            if (err)
                throw err;
        });
        res.render("forminu/fetchuser");
    });
});
route.get("/alluser", checkauth_1.default, (req, res) => {
    res.render("forminu/fetchuser");
});
route.get("/normalupdate/:id", checkauth_1.default, async (req, res) => {
    const id = req.params.id;
    if (id) {
        const query = (str) => {
            return new Promise((resolve, reject) => {
                database_1.default.query(str, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            });
        };
        try {
            const count = await query(`select count(*) as lt from edu_detail where emp_id=${id};`);
            if (count[0].lt >= 1) {
                const result = await query(`select * from emp_details where emp_id=${id};`);
                const queries = [
                    `select * from edu_detail where emp_id=${id};`,
                    `select * from work_experience where emp_id=${id};`,
                    `select * from language where emp_id=${id};`,
                    `select * from know_techno where emp_id=${id};`,
                    `select * from reference_contact where emp_id=${id};`,
                    `select * from preferences where emp_id=${id};`,
                ];
                const [result1, result2, result3, result4, result5, result6] = await Promise.all(queries.map(query));
                const tech = result4.map((item) => item.tech_know);
                const techlevel = result4.map((item) => item.tech_know + item.level_of_technology);
                const lan = result3.map((item) => item.language_know);
                const arr1 = result3
                    .find((item) => item.language_know === "hindi")
                    ?.rws.split(",") || [];
                const arr2 = result3
                    .find((item) => item.language_know === "english")
                    ?.rws.split(",") || [];
                const arr3 = result3
                    .find((item) => item.language_know === "gujarati")
                    ?.rws.split(",") || [];
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
        catch (err) {
            console.error(err);
            // Handle error response
        }
    }
});
route.post("/normalupdate/:id", urlencodedParser, [
    (0, express_validator_1.check)("fname", "This username must me 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("lname", "This lastname must me 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("designa", "This designation must me 3+ characters long")
        .exists()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("dob", "Enter date-of-birth in yyyy-mm-dd formate").isDate(),
    (0, express_validator_1.check)("email", "Email is not valid").isEmail().normalizeEmail(),
    // check("number", "Please enter valid Mobile Number").isMobilePhone(),
    (0, express_validator_1.check)("zipcode", "zipcode length should be 6 characters").isLength({
        min: 6,
        max: 6,
    }),
    (0, express_validator_1.check)("add1", "address1 length should be 6 to 45 characters").isLength({
        min: 6,
        max: 45,
    }),
    (0, express_validator_1.check)("add2", "address2 length should be 6 to 45 characters").isLength({
        min: 6,
        max: 45,
    }),
], async (req, res) => {
    let id = req.params.id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("forminu/home", {
            alert,
        });
    }
    let jsondata = req.body;
    if (req.params.id) {
        let query = (str) => {
            return new Promise((resolve, reject) => {
                database_1.default.query(str, (err, result) => {
                    if (err)
                        throw err;
                    else {
                        resolve(result);
                    }
                });
            });
        };
        // =========section1===============
        const { fname, lname, designation, email, phone, gender, rel_status, address1, address2, city, state, zipcode, bd, } = jsondata;
        let emp_detail = await query(`UPDATE emp_details
          SET fname='${fname}', lname='${lname}',designation='${designation}',email='${email}',phone='${phone}',gender='${gender}',
          rel_status='${rel_status}',address1='${address1}',address2='${address2}',city='${city}',
          state='${state}',zipcode='${zipcode}',bd='${bd}'
          WHERE emp_id='${id}';`);
        //==========section2=============
        let edu = ["ssc", "hsc", "bachelor", "master"];
        let len = req.body.board_name;
        let arr6 = await query(`select edu_id as edu_id from edu_detail where emp_id in(${id});`);
        for (let i = 0; i < len.length; i++) {
            if (arr6[i]) {
                let edu_detail = await query(`UPDATE edu_detail
          SET Name_of_board_or_course='${req.body.board_name[i]}',Passing_year='${req.body.py[i]}',Percentage='${req.body.percentage[i]}'
          WHERE emp_id='${id}' and type_of_result='${edu[i]}' and edu_id='${arr6[i].edu_id}';`);
            }
            else {
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
        let arr = await query(`select id as work_id from emp.work_experience where emp_id in(${id});`);
        ;
        let wklen = req.body.companyname;
        for (let i = 0; i < wklen.length; i++) {
            if (arr[i]) {
                let work_exp = await query(`UPDATE work_experience
              SET company_name='${req.body.companyname[i]}',designation='${req.body.designation[i]}',from_date='${req.body.from[i]}',to_date='${req.body.to[i]}'
              WHERE emp_id='${id}' and id='${arr[i].work_id}';`);
                ;
            }
            else {
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
        let arr5 = await query(`select id as tech_id from emp.know_techno where emp_id in(${id});`);
        ;
        for (let i = 0; i < tech.length; i++) {
            if (arr5[i]) {
                let tech_edit = await query(`UPDATE know_techno set
                   tech_know='${tech[i]}',
                   level_of_technology= '${level[i]}'
                    where emp_id='${id}' and id='${arr5[i].tech_id}';`);
            }
            else {
                if (tech[i]) {
                    let insert_tech = await query(`insert into know_techno(emp_id,tech_know ,level_of_technology) values('${id}','${tech[i]}','${level[i]}')`);
                }
            }
        }
        //section ref
        let arr2 = await query(`select ref_id as ref_id from reference_contact where emp_id in(${id});`);
        ;
        let reflen = req.body.name;
        for (let i = 0; i < reflen.length; i++) {
            if (arr2[i]) {
                let work_exep = await query(`UPDATE reference_contact
            SET name='${req.body.name[i]}',contact_number='${req.body.mobileno[i]}',relation='${req.body.rel[i]}'
            WHERE emp_id='${id}' and ref_id='${arr2[i].ref_id}';`);
            }
            else {
                if (reflen[i]) {
                    let ins_workexp = await query(`insert into reference_contact(emp_id, name ,
              contact_number ,relation) values('${id}','${req.body.name[i]}','${req.body.mobileno[i]}','${req.body.rel[i]}');`);
                }
            }
        }
        //section ended
        let pref = await query(`UPDATE preferences
        SET prefered_location='${req.body.preloc}', notice_period='${req.body.notice}',expected_ctc='${req.body.exctc}',current_ctc='${req.body.curctc}',department='${req.body.depa}'
        WHERE emp_id='${id}';`);
        //end
    }
    res.send(`data is succesfully updated `);
});
exports.default = route;
//# sourceMappingURL=simpleform.js.map