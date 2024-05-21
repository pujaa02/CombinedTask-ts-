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
const singletask_1 = __importDefault(require("../controller/singletask"));
const orderby_1 = __importDefault(require("../controller/orderby"));
const frame_1 = __importDefault(require("../controller/frame"));
const simpleform_1 = __importDefault(require("../controller/simpleform"));
const attendance_1 = __importDefault(require("../controller/attendance"));
const result_1 = __importDefault(require("../controller/result"));
const fetchusingquery_1 = __importDefault(require("../controller/fetchusingquery"));
const dynamicgrid_1 = __importDefault(require("../controller/dynamicgrid"));
const delimeter_1 = __importDefault(require("../controller/delimeter"));
const generateform_1 = __importDefault(require("../controller/generateform"));
const ajaxform_1 = __importDefault(require("../controller/ajaxform"));
const fetchcity_1 = __importDefault(require("../controller/fetchcity"));
const timestamp_1 = __importDefault(require("../controller/timestamp"));
const login_1 = __importDefault(require("../controller/login"));
const error_1 = __importDefault(require("../controller/error"));
route.use(singletask_1.default);
route.use(orderby_1.default);
route.use(attendance_1.default);
route.use(result_1.default);
route.use(fetchusingquery_1.default);
route.use(dynamicgrid_1.default);
route.use(delimeter_1.default);
route.use(generateform_1.default);
route.use(simpleform_1.default);
route.use(ajaxform_1.default);
route.use(fetchcity_1.default);
route.use(timestamp_1.default);
route.use(frame_1.default);
route.use(login_1.default);
route.use(error_1.default);
exports.default = route;
//# sourceMappingURL=router.js.map