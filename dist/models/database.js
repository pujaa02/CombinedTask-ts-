"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const con = mysql2_1.default.createConnection({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    dateStrings: true,
});
con.connect((err) => {
    if (err)
        throw err;
    console.log("connected!!");
});
exports.default = con;
// import Db from 'mysql2-async'
// export const db = new Db({
//   host: 'yourhost',
//   ...
// })
// async function main() {
//   const row = await db.getrow('SELECT ...')
// }
// main().catch(e => console.error(e))
//# sourceMappingURL=database.js.map