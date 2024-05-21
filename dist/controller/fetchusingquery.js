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
route.get("/fetch", checkauth_1.default, (req, res) => {
    res.render("taskzero/home");
});
route.post("/fetch", async function (req, res) {
    let jsonData = req.body;
    let search = jsonData["query"];
    let perPage = 20;
    let page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;
    if (search === "") {
        res.send("Please Write Query First");
    }
    else if (search.startsWith("delete") ||
        search.startsWith("update") ||
        search.startsWith("drop")) {
        res.send("Please write only select query");
    }
    else if (search.search("limit") > 1) {
        let q = `${search}`;
        try {
            let [rows, fields] = await database_1.default.getall(q, [offset, perPage]);
            res.render("taskzero/nolimit", { users: rows, field: fields });
        }
        catch (error) {
            res.render("taskzero/home2", { error: error });
        }
    }
    else {
        let str = search;
        str = str.replace(";", " Limit ?,? ;");
        let q = `${str}`;
        let q2 = `${search}`;
        try {
            let [rows1, fields1] = await database_1.default.getall(q2);
            let [rows2, fields2] = await database_1.default.getall(q, [offset, perPage]);
            res.render("taskzero/data", {
                users: rows2,
                field: fields2,
                page,
                search,
                len: rows1,
            });
        }
        catch (error) {
            res.render("taskzero/home2", { error: error });
        }
    }
});
route.get("/fetchdata/:page/:query", checkauth_1.default, async function (req, res) {
    let search = req.params.query;
    let page = parseInt(req.params.page);
    let perPage = 20;
    const offset = (page - 1) * perPage;
    let sql = search;
    sql = sql.replace(";", " Limit ?,? ;");
    let q = `${sql}`;
    let q2 = `${search}`;
    let [rows3, fields3] = await database_1.default.getall(q2);
    let [rows4, fields4] = await database_1.default.getall(q, [offset, perPage]);
    res.render("taskzero/data", {
        users: rows4,
        field: fields4,
        search,
        page,
        len: rows3,
    });
});
exports.default = route;
//# sourceMappingURL=fetchusingquery.js.map