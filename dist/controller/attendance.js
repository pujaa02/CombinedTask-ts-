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
route.get("/att", checkauth_1.default, async (req, res) => {
    let m, y;
    if (req.query.months && req.query.year) {
        m = parseInt(req.query.months);
        y = parseInt(req.query.year);
    }
    else {
        m = 12;
        y = 2023;
    }
    const perPage = 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;
    const result = await database_1.default.getall(`SELECT student_master26.id, student_master26.firstname,
  YEAR(att_master26.date) AS year, 
  MONTH(att_master26.date) AS month, 
  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/30),2 )as Percentage  FROM student_master26 
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where YEAR(att_master26.date)=${y} and MONTH(att_master26.date)=${m} GROUP BY year, month,student_master26.id LIMIT ?, ?`, [offset, perPage]);
    res.render("atten/Attendance(27)", { users: result, page });
});
route.get("/att/:fd", checkauth_1.default, async (req, res) => {
    const field = req.params.fd;
    let m, y;
    if (req.query.months && req.query.year) {
        m = parseInt(req.query.months);
        y = parseInt(req.query.year);
    }
    else {
        m = 12;
        y = 2023;
    }
    const perPage = 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;
    const result1 = await database_1.default.getall(`SELECT student_master26.id, student_master26.firstname,
  YEAR(att_master26.date) AS year, 
  MONTH(att_master26.date) AS month, 
  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/30),2 )as Percentage  FROM student_master26 
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where YEAR(att_master26.date)=${y} and MONTH(att_master26.date)=${m} GROUP BY year, month,student_master26.id order by ${field} desc LIMIT ?, ?`, [offset, perPage]);
    res.render("atten/Attendance(27)", { users: result1, page });
});
route.get("/data/:fd", checkauth_1.default, async (req, res) => {
    const field = req.params.fd;
    let m, y;
    if (req.query.months && req.query.year) {
        m = parseInt(req.query.months);
        y = parseInt(req.query.year);
    }
    else {
        m = 12;
        y = 2023;
    }
    const perPage = 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;
    const result3 = await database_1.default.getall(`SELECT student_master26.id, student_master26.firstname,
  YEAR(att_master26.date) AS year, 
  MONTH(att_master26.date) AS month, 
  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/30),2 )as Percentage  FROM student_master26 
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where YEAR(att_master26.date)=${y} and MONTH(att_master26.date)=${m} GROUP BY year, month,student_master26.id order by ${field} LIMIT ?, ?`, [offset, perPage]);
    res.render("atten/Attendance(27)", { users: result3, page });
});
exports.default = route;
//# sourceMappingURL=attendance.js.map