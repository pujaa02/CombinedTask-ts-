import express, { Application} from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import main from "./routes/router"
const app: Application = express();
dotenv.config();
let port = process.env.PORT;

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
try {
  app.listen(port, () => {
      console.log(`Server is running in port: ${port} `);
      app.use(main);
  });
} catch (error) {
  console.log(
    `Error: ${error}`
  );
}
