import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";

route.get("/timestamp", checkAuth, (req: Request, res: Response) => {
  res.render("timestamp/home");
});

export default route;
