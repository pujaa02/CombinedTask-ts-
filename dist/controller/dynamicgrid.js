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
route.get("/fetch2", checkauth_1.default, (req, res) => {
    res.render("taskone/home");
});
route.post("/fetch2", (req, res) => {
    let jsonData = req.body;
    let search = jsonData["query"];
    let perPage = 5;
    let page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;
    let q1 = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%'`;
    let q = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%' LIMIT ?, ?`;
    database_1.default.query(q1, (err, ans) => {
        if (err)
            throw err;
        database_1.default.query(q, [offset, perPage], (err, result) => {
            if (err)
                throw err;
            res.render("taskone/data", { users: result, page, search, len: ans });
        });
    });
});
route.get("/fetch2/:page/:search", checkauth_1.default, (req, res) => {
    let search = req.params.search;
    let perPage = 5;
    let page = parseInt(req.params.page) || 1;
    const offset = (page - 1) * perPage;
    let q1 = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%'`;
    let q = `SELECT * FROM student_master26 WHERE id LIKE '%${search}%' LIMIT ?, ?`;
    database_1.default.query(q1, (err, ans) => {
        if (err)
            throw err;
        database_1.default.query(q, [offset, perPage], (err, result) => {
            if (err)
                throw err;
            res.render("taskone/data", { users: result, page, search, len: ans });
        });
    });
});
route.get("/view", checkauth_1.default, (req, res) => {
    res.render("taskone/form2");
});
let fname;
let lname;
let email;
let city;
let bg;
route.post("/view", (req, res) => {
    let data = JSON.stringify(req.body);
    let jsonData = req.body;
    let fname = jsonData["fname"];
    let lname = jsonData["lname"];
    let email = jsonData["email"];
    let city = jsonData["city"];
    let bg = jsonData["bg"];
    let opa = jsonData["opa"];
    let perPage = 20;
    let page = parseInt(req.params.page) || 1;
    const offset = (page - 1) * perPage;
    let q1 = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa}  city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%'`;
    let q = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa}  city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%' LIMIT ?, ?`;
    database_1.default.query(q1);
    database_1.default.query(q, [offset, perPage], (err, ans) => {
        if (err)
            throw err;
        database_1.default.query(q, [offset, perPage], (err, result) => {
            if (err)
                throw err;
            res.render("taskone/data2", {
                users: result,
                page,
                len: ans,
                data,
            });
        });
    });
});
route.get("/view/:page/:jsonData", checkauth_1.default, (req, res) => {
    let jsonData = req.params.jsonData;
    let data = JSON.parse(jsonData);
    let fname = data.fname;
    let lname = data.lname;
    let email = data.email;
    let city = data.city;
    let bg = data.bg;
    let opa = data.opa;
    let perPage = 20;
    let page = parseInt(req.params.page) || 1;
    const offset = (page - 1) * perPage;
    let q1 = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa} city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%'`;
    let q = `SELECT * FROM student_master26 WHERE firstname LIKE '%${fname}%' ${opa} lastname LIKE '%${lname}%' ${opa} email LIKE '%${email}%' ${opa} city LIKE '%${city}%' ${opa} blood_group LIKE '%${bg}%' LIMIT ?, ?`;
    database_1.default.query(q1);
    database_1.default.query(q, [offset, perPage], (err, ans) => {
        if (err)
            throw err;
        database_1.default.query(q, [offset, perPage], (err, result) => {
            if (err)
                throw err;
            res.render("taskone/data2", {
                users: result,
                page,
                len: ans,
                data: jsonData,
            });
        });
    });
});
exports.default = route;
//# sourceMappingURL=dynamicgrid.js.map