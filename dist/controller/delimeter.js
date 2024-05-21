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
const body_parser_1 = __importDefault(require("body-parser"));
route.use(body_parser_1.default.json());
route.use(body_parser_1.default.urlencoded({ extended: false }));
route.get("/sch", checkauth_1.default, (req, res) => {
    res.render("specialchar/home");
});
route.post("/sch", (req, res) => {
    let fname = [], lname = [], email = [], number = [], city = [], bg = [];
    let jsonData = req.body;
    let search = jsonData["query"];
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(`${search}`)) {
        let str = search.replace(/(?=[$-/:-?{-~!"^_`\[\]])/gi, ",");
        let val = str.split(",");
        for (var i = 0; i < val.length; i++) {
            if (val[i].startsWith("_")) {
                let firstname = val[i].replace("_", "");
                fname.push(firstname);
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
                bg.push(blood);
            }
        }
        let q1 = `select * from student_master26 where `;
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
        database_1.default.query(q1, (err, result) => {
            if (err)
                throw err;
            res.render("specialchar/data.ejs", { users: result });
        });
    }
    else {
        res.render("specialchar/home2.ejs");
    }
});
exports.default = route;
//# sourceMappingURL=delimeter.js.map