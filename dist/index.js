"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
let port = process.env.PORT;
const main = require("./routes/router");
app.use((0, cookie_parser_1.default)());
app.set("view engine", "ejs");
app.use(express_1.default.static(__dirname + "/public"));
try {
    app.listen(port, () => {
        console.log(`Server is running in port: ${port} `);
        app.use(main);
    });
}
catch (error) {
    console.log(`Error: other server is running in  ${port} ,change the port number`);
}
//# sourceMappingURL=index.js.map