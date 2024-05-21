import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";

route.get("*",checkAuth, (req: Request, res: Response) => {
  res.render("error");
});

export default route;
