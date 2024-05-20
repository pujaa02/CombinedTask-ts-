import express, { Application} from "express";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app: Application = express();
dotenv.config();
let port = process.env.PORT;

const main = require("./routes/router");
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

try {
  app.listen(port, () => {
      console.log(`Server is running in port: ${port} `);
      app.use(main);
  });
} catch (error) {
  console.log(
    `Error: other server is running in  ${port} ,change the port number`
  );
}
