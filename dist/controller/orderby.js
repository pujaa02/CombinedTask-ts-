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
var name;
route.get("/data", checkauth_1.default, (req, res) => {
    let name;
    if (req.query.field) {
        name = req.query.field;
    }
    else {
        name = "id";
    }
    const perPage = 200; // Number of items per page
    let page = parseInt(req.query.page) || 1; // Current page number
    // Calculate offset
    const offset = (page - 1) * perPage;
    //offset= (perPage * page) - perPage
    // Fetch data for current page
    database_1.default.query(`SELECT * FROM student_master26 order by ${name} LIMIT ?, ?`, [offset, perPage], (error, results) => {
        if (error)
            throw error;
        database_1.default.query("SELECT COUNT(*) AS count FROM student_master26", (error) => {
            if (error)
                throw error;
            res.render("order/orderpagination26", {
                users: results,
                page: page,
                field: req.query.field,
            });
        });
    });
});
exports.default = route;
//# sourceMappingURL=orderby.js.map