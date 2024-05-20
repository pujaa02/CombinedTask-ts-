import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";

route.get("/frame1", checkAuth, (req: Request, res: Response) => {
  res.render("frame1/f1");
});
route.get("/frame2", checkAuth, (req: Request, res: Response) => {
  res.render("frame2/f2");
});
route.get("/frame3", checkAuth, (req: Request, res: Response) => {
  res.render("frame3/f3");
});

export default route;
