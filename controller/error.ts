import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";

route.get("*", (req: Request, res: Response) => {
  res.render("error");
});

export default route;
