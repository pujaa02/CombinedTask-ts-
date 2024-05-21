import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";

import get_data from "./ajaxcityfetch/get_data"
import get_city from "./ajaxcityfetch/get_cities";

route.get("/state", checkAuth, get_data);
route.get("/cities", checkAuth,  get_city);

route.get("/fetchcity", checkAuth, (req: Request, res: Response) => {
  res.render("fetchcity/home");
});

export default route;
