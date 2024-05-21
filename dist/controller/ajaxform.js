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
const database_1 = __importDefault(require("../models/database"));
// const { check, validationResult } = require("express-validator");
const express_validator_1 = require("express-validator");
// import  { check, validationResult }  = require('express-validator');
const body_parser_1 = __importDefault(require("body-parser"));
route.use(body_parser_1.default.json());
route.use(body_parser_1.default.urlencoded({ extended: false }));
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
const get_user_1 = __importDefault(require("./ajaxinsertupdate/get_user"));
const get_emp_det_1 = __importDefault(require("./ajaxinsertupdate/get_emp_det"));
const get_edu_det_1 = __importDefault(require("./ajaxinsertupdate/get_edu_det"));
const work_exp_1 = __importDefault(require("./ajaxinsertupdate/work_exp"));
const language_1 = __importDefault(require("./ajaxinsertupdate/language"));
const techno_1 = __importDefault(require("./ajaxinsertupdate/techno"));
const ref_1 = __importDefault(require("./ajaxinsertupdate/ref"));
const pre_1 = __importDefault(require("./ajaxinsertupdate/pre"));
route.get("/users", checkauth_1.default, get_user_1.default);
route.get("/emp", checkauth_1.default, get_emp_det_1.default);
route.get("/edu", checkauth_1.default, get_edu_det_1.default);
route.get("/work", checkauth_1.default, work_exp_1.default);
route.get("/lan", checkauth_1.default, language_1.default);
route.get("/tech", checkauth_1.default, techno_1.default);
route.get("/ref", checkauth_1.default, ref_1.default);
route.get("/pre", checkauth_1.default, pre_1.default);
const query = (str) => {
    return new Promise((resolve, reject) => {
        database_1.default.query(str, (err, result) => {
            console.log(str);
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
route.get("/inuajax", checkauth_1.default, (req, res) => {
    res.render("ajaxinup/home");
});
route.get("/update", checkauth_1.default, (req, res) => {
    res.render("ajaxinup/fetchuser");
});
route.post("/submit", urlencodedParser, [
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
], (req, res) => {
    console.log("this is update post");
    const formData = req.body;
    console.log(formData);
    let id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("ajaxinup/home", { alert });
    }
    const { fname, lname, designa: designation, email, number: phone, gender, relstatus: rel_status, add1: address1, add2: address2, city, state, zipcode, dob: bd, } = formData;
    const edu = ["ssc", "hsc", "bachelor", "master"];
    const lan1 = ["", "", ""];
    const lan2 = ["", "", ""];
    const lan3 = ["", "", ""];
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
    const tech1 = ["", "", ""];
    const tech2 = ["", "", ""];
    const tech3 = ["", "", ""];
    const tech4 = ["", "", ""];
    tech1[1] = formData.tech1;
    tech1[2] = formData.level1;
    tech2[1] = formData.tech2;
    tech2[2] = formData.level2;
    tech3[1] = formData.tech3;
    tech3[2] = formData.level3;
    tech4[1] = formData.tech4;
    tech4[2] = formData.level4;
    const ref1 = ["", "", "", ""];
    const ref2 = ["", "", "", ""];
    const ref3 = ["", "", "", ""];
    ref1[1] = formData.name1;
    ref1[2] = formData.mobileno1;
    ref1[3] = formData.rel1;
    ref2[1] = formData.name2;
    ref2[2] = formData.mobileno2;
    ref2[3] = formData.rel2;
    ref3[1] = formData.name3;
    ref3[2] = formData.mobileno3;
    ref3[3] = formData.rel3;
    const pre = ["", "", "", "", "", ""];
    pre[1] = formData.preloc;
    pre[2] = formData.notice;
    pre[3] = formData.exctc;
    pre[4] = formData.curctc;
    pre[5] = formData.depa;
    const q = `INSERT INTO emp_details (fname, lname, designation, email, phone, gender, rel_status, address1, address2, city, state, zipcode, bd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        fname,
        lname,
        designation,
        email,
        phone,
        gender,
        rel_status,
        address1,
        address2,
        city,
        state,
        zipcode,
        bd,
    ];
    console.log(q);
    database_1.default.query(q, values, (err, result) => {
        if (err)
            throw err;
        id = result.insertId;
        const len = formData.board_name.length;
        for (let i = 0; i < len; i++) {
            const q1 = `INSERT INTO edu_detail (emp_id, type_of_result, Name_of_board_or_course, Passing_year, Percentage) VALUES (?, ?, ?, ?, ?)`;
            const eduValues = [
                id,
                edu[i],
                formData.board_name[i],
                formData.py[i],
                formData.percentage[i],
            ];
            if (formData.board_name[i]) {
                database_1.default.query(q1, eduValues, (err, result1) => {
                    console.log(q1);
                    if (err)
                        throw err;
                    console.log("result is: ");
                    console.log(result1);
                });
            }
        }
        const wklen = formData.companyname.length;
        for (let i = 0; i < wklen; i++) {
            const q2 = `INSERT INTO work_experience (emp_id, company_name, designation, from_date, to_date) VALUES (?, ?, ?, ?, ?)`;
            const workValues = [
                id,
                formData.companyname[i],
                formData.designation[i],
                formData.from[i],
                formData.to[i],
            ];
            if (formData.companyname[i]) {
                database_1.default.query(q2, workValues, (err, result1) => {
                    console.log(q2);
                    if (err)
                        throw err;
                    console.log("result is: ");
                    console.log(result1);
                });
            }
        }
        const q3 = `INSERT INTO language (emp_id, language_know, rws) VALUES (?)`;
        if (formData.lan1) {
            lan1[0] = id;
            database_1.default.query(q3, [lan1], (err, result) => {
                if (err)
                    throw err;
                console.log("result is: ");
                console.log(result);
            });
        }
        if (formData.lan2) {
            lan2[0] = id;
            database_1.default.query(q3, [lan2], (err, result) => {
                if (err)
                    throw err;
                console.log("result is: ");
                console.log(result);
            });
        }
        if (formData.lan3) {
            lan3[0] = id;
            database_1.default.query(q3, [lan3], (err, result) => {
                if (err)
                    throw err;
                console.log("result is: ");
                console.log(result);
            });
        }
        let q4 = `insert into know_techno(emp_id,tech_know ,level_of_technology) values( ? )`;
        tech1[0] = id;
        if (formData.tech1) {
            database_1.default.query(q4, [tech1], (err, result) => {
                if (err)
                    throw err;
                console.log("result is : ");
                console.log(result);
            });
        }
        tech2[0] = id;
        if (formData.tech2) {
            database_1.default.query(q4, [tech2], (err, result) => {
                if (err)
                    throw err;
                console.log("result is : ");
                console.log(result);
            });
        }
        tech3[0] = id;
        if (formData.tech3) {
            database_1.default.query(q4, [tech3], (err, result) => {
                if (err)
                    throw err;
                console.log("result is : ");
                console.log(result);
            });
        }
        tech4[0] = id;
        if (formData.tech4) {
            database_1.default.query(q4, [tech4], (err, result) => {
                if (err)
                    throw err;
                console.log("result is : ");
                console.log(result);
            });
        }
        //section ref
        let reflen = formData.name;
        for (let i = 0; i < reflen.length; i++) {
            let q5 = `insert into reference_contact(emp_id, name ,contact_number ,relation) values('${id}','${formData.name[i]}','${formData.mobileno[i]}','${formData.rel[i]}');`;
            if (formData.name[i]) {
                database_1.default.query(q5, (err, result1) => {
                    console.log(q5);
                    if (err)
                        throw err;
                    console.log("result is : ");
                    console.log(result1);
                });
            }
        }
        //section ended
        let q6 = `insert into preferences(emp_id, prefered_location,notice_period , expected_ctc,current_ctc , department) values( ? )`;
        pre[0] = id;
        database_1.default.query(q6, [pre], (err, result) => {
            if (err)
                throw err;
            console.log("result is : ");
            console.log(result);
        });
        res.json(`result id is : ${result.insertId} `);
    });
});
route.get("/update/:id", checkauth_1.default, (req, res) => {
    let id = req.params.id;
    res.render("ajaxinup/home", { id });
});
route.post("/update/:id", urlencodedParser, [
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
    console.log(id);
    console.log("this is update post");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("ajaxinup/home", {
            alert,
        });
    }
    const formData = req.body;
    console.log(formData);
    if (req.params.id) {
        // Section 1
        const { fname, lname, designa, email, number, gender, relstatus, add1, add2, city, state, zipcode, dob, } = formData;
        await query(`UPDATE emp_details
        SET fname='${fname}', lname='${lname}', designation='${designa}', email='${email}', phone='${number}', gender='${gender}',
        rel_status='${relstatus}', address1='${add1}', address2='${add2}', city='${city}', state='${state}', zipcode='${zipcode}', bd='${dob}'
        WHERE emp_id='${id}';`);
        // Section 2
        const edu = ["ssc", "hsc", "bachelor", "master"];
        const len = formData.board_name.length;
        const eduDetails = await query(`SELECT edu_id FROM edu_detail WHERE emp_id IN (${id});`);
        for (let i = 0; i < len; i++) {
            if (eduDetails[i]) {
                await query(`UPDATE edu_detail
            SET Name_of_board_or_course='${formData.board_name[i]}', Passing_year='${formData.py[i]}', Percentage='${formData.percentage[i]}'
            WHERE emp_id='${id}' AND type_of_result='${edu[i]}' AND edu_id='${eduDetails[i].edu_id}';`);
            }
            else {
                if (formData.board_name[i]) {
                    await query(`INSERT INTO edu_detail (emp_id, type_of_result, Name_of_board_or_course, Passing_year, Percentage)
              VALUES ('${id}', '${edu[i]}', '${formData.board_name[i]}', '${formData.py[i]}', '${formData.percentage[i]}');`);
                }
            }
        }
        // Section 3
        const workExperience = await query(`SELECT id AS work_id FROM work_experience WHERE emp_id IN (${id});`);
        const wklen = formData.companyname.length;
        for (let i = 0; i < wklen; i++) {
            if (workExperience[i]) {
                await query(`UPDATE work_experience
            SET company_name='${formData.companyname[i]}', designation='${formData.designation[i]}', from_date='${formData.from[i]}', to_date='${formData.to[i]}'
            WHERE emp_id='${id}' AND id='${workExperience[i].work_id}';`);
            }
            else {
                if (formData.companyname[i]) {
                    await query(`INSERT INTO work_experience (emp_id, company_name, designation, from_date, to_date)
              VALUES ('${id}', '${formData.companyname[i]}', '${formData.designation[i]}', '${formData.from[i]}', '${formData.to[i]}');`);
                }
            }
        }
        // Languages
        const languages = [];
        const rws = [];
        if (formData.lan1) {
            languages.push(formData.lan1);
            rws.push(formData.able1);
        }
        if (formData.lan2) {
            languages.push(formData.lan2);
            rws.push(formData.able2);
        }
        if (formData.lan3) {
            languages.push(formData.lan3);
            rws.push(formData.able3);
        }
        await query(`DELETE FROM language WHERE emp_id='${id}';`);
        for (let i = 0; i < languages.length; i++) {
            await query(`INSERT INTO language (emp_id, language_know, rws)
          VALUES ('${id}', '${languages[i]}', '${rws[i]}');`);
        }
        // Technologies
        const tech = [];
        const level = [];
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
        const technoDetails = await query(`SELECT id AS tech_id FROM know_techno WHERE emp_id IN (${id});`);
        for (let i = 0; i < tech.length; i++) {
            if (technoDetails[i]) {
                await query(`UPDATE know_techno
            SET tech_know='${tech[i]}', level_of_technology='${level[i]}'
            WHERE emp_id='${id}' AND id='${technoDetails[i].tech_id}';`);
            }
            else {
                if (tech[i]) {
                    await query(`INSERT INTO know_techno (emp_id, tech_know, level_of_technology)
              VALUES ('${id}', '${tech[i]}', '${level[i]}');`);
                }
            }
        }
        // References
        const references = await query(`SELECT ref_id FROM reference_contact WHERE emp_id IN (${id});`);
        const refLen = formData.name.length;
        for (let i = 0; i < refLen; i++) {
            if (references[i]) {
                await query(`UPDATE reference_contact
            SET name='${formData.name[i]}', contact_number='${formData.mobileno[i]}', relation='${formData.rel[i]}'
            WHERE emp_id='${id}' AND ref_id='${references[i].ref_id}';`);
            }
            else {
                if (formData.name[i]) {
                    await query(`INSERT INTO reference_contact (emp_id, name, contact_number, relation)
              VALUES ('${id}', '${formData.name[i]}', '${formData.mobileno[i]}', '${formData.rel[i]}');`);
                }
            }
        }
        // Preferences
        const { preloc, notice, exctc, curctc, depa } = formData;
        await query(`UPDATE preferences
        SET prefered_location='${preloc}', notice_period='${notice}', expected_ctc='${exctc}', current_ctc='${curctc}', department='${depa}'
        WHERE emp_id='${id}';`);
    }
    res.json("data updated");
});
route.get("/showupdate", checkauth_1.default, (req, res) => {
    res.send("Data is Succesfully Updated!!");
});
exports.default = route;
//# sourceMappingURL=ajaxform.js.map