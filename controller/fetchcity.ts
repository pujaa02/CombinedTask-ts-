import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";

var get_data = require("../public/js/ajaxcityfetch/get_data");
var get_city = require("../public/js/ajaxcityfetch/get_cities");

route.get("/state", checkAuth, get_data);
route.get("/cities", checkAuth, get_city);

route.get("/fetchcity", checkAuth, (req: Request, res: Response) => {
  res.render("fetchcity/home");
});

export default route;
