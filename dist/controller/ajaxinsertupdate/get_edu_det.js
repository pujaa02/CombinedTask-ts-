"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../models/database"));
function edu_det(req, res) {
    database_1.default.query(`select * from edu_detail `, async function (err, result, fields) {
        if (err)
            throw err;
        const data = await result;
        res.json(data);
    });
}
exports.default = edu_det;
//# sourceMappingURL=get_edu_det.js.map