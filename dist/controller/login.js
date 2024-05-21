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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const checkdate_1 = __importDefault(require("./checkdate"));
route.use(body_parser_1.default.json());
route.use(body_parser_1.default.urlencoded({ extended: false }));
// import {Md5} from 'ts-md5';
var md5 = require("md5");
dotenv.config();
route.get("/getData", checkdate_1.default);
route.get("/", (req, res) => {
    res.render("frontpage/home");
});
//==========================  insert reg data ========================
let lastid;
route.post("/register/:str", async (req, res) => {
    let formData = req.body;
    let str = req.params.str;
    let fname = formData.fname;
    let lname = formData.lname;
    let email = formData.email;
    const result1 = await database_1.default.getall(`insert into login(fname,lname,email,activatecode,date_time,status) values('${fname}','${lname}','${email}','${str}',CURRENT_TIMESTAMP(),'deactive')`);
    lastid = result1;
    res.json("123");
});
// ==============actcode to password page================
route.get("/create_password/:actcode", (req, res) => {
    let active = req.params.actcode;
    res.render("frontpage/password", { active });
});
//===================after insert data ================
route.get("/afterregister/:str", (req, res) => {
    let actcode = req.params.str;
    res.render("frontpage/activationpage", { lastid, actcode });
});
//================checktime while update password======================
route.get("/checktime/:actcode", async (req, res) => {
    let actcode = req.params.actcode;
    let result = await database_1.default.getall(`select date_time from login where activatecode='${actcode}'`);
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
        }
        else {
            let result1 = await database_1.default.delete(`delete from login where activatecode='${actcode}'`);
            res.json("1");
        }
    }
    else {
        res.json("2");
    }
});
//===============generate salt=============
function genesalt() {
    let length = 4;
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const total = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * total));
        counter += 1;
    }
    return result;
}
//===========regtration password set==============
route.post("/successreg/:actcd", async (req, res) => {
    let code = req.params.actcd;
    let formData = req.body;
    let pass = formData.pass;
    let salt = genesalt(); // Assuming genesalt() is defined elsewhere
    let combine = pass + salt;
    let finalpass = md5(combine); // Assuming Md5() is defined elsewhere
    let result1 = await database_1.default.update(`update login set password='${finalpass}', salt='${salt}',status='active' where  activatecode='${code}'`);
    res.json("123");
});
//===========regtration password update==============
route.post("/updatepass/:mail", async (req, res) => {
    let mail = req.params.mail;
    let formData = req.body;
    let pass = formData.pass;
    let salt = genesalt();
    let combine = pass + salt;
    let finalpass = md5(combine);
    // Assuming Md5() is defined elsewhere
    let result1 = await database_1.default.update(`update login set password='${finalpass}', salt='${salt}' where email='${mail}'`);
    res.json("123");
});
//==============login==================
route.get("/login/", (req, res) => {
    res.render("frontpage/login");
});
// ===================clicked on forget password btn at login page=========================
route.get("/secondpage/:str", (req, res) => {
    res.render("frontpage/password");
});
let token;
route.post("/loginpage", async (req, res) => {
    let formData = req.body;
    let user = formData.user;
    let pass = formData.pass;
    let combine;
    let flag = true;
    let result = await database_1.default.getall(`select email,password,salt from login where email='${user}'`);
    if (result.length > 0 && result[0].email === user) {
        combine = pass + result[0].salt;
        let resPassword = md5(combine);
        if (resPassword === result[0].password) {
            token = jsonwebtoken_1.default.sign({ email: result[0].email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            res.cookie("token", token);
        }
        else {
            flag = false;
        }
    }
    else {
        flag = false;
    }
    res.json({ flag, token });
});
route.get("/completelogin", checkauth_1.default, (req, res) => {
    res.render("Home");
});
route.get("/redirect/:mail", checkauth_1.default, async (req, res) => {
    let mail = req.params.mail;
    let result1 = await database_1.default.getall(`select * from login where email='${mail}' `);
    if (result1.length > 0) {
        res.json("email valid");
    }
    else {
        res.json("email not valid");
    }
});
exports.default = route;
//# sourceMappingURL=login.js.map