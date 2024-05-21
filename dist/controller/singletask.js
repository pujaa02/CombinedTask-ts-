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
route.get("/dynamic_table", checkauth_1.default, (req, res) => {
    res.render("singleTask/dynamic_table");
});
route.get("/kukucube", checkauth_1.default, (req, res) => {
    res.render("singleTask/kukucube");
});
route.get("/tic-tac-toe", checkauth_1.default, (req, res) => {
    res.render("singleTask/tic-tac-toe");
});
route.get("/sorting", checkauth_1.default, (req, res) => {
    res.render("singleTask/sorting");
});
route.get("/events", checkauth_1.default, (req, res) => {
    res.render("singleTask/events");
});
route.get("/job_app", checkauth_1.default, (req, res) => {
    res.render("singleTask/job_application");
});
route.get("/calculator", checkauth_1.default, (req, res) => {
    res.render("singleTask/calculator");
});
route.get("/todolist", checkauth_1.default, (req, res) => {
    res.render("singleTask/todo");
});
exports.default = route;
//# sourceMappingURL=singletask.js.map