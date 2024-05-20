import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";

route.get("/dynamic_table", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/dynamic_table");
});

route.get("/kukucube", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/kukucube");
});

route.get("/tic-tac-toe", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/tic-tac-toe");
});

route.get("/sorting", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/sorting");
});
route.get("/events", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/events");
});
route.get("/job_app", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/job_application");
});

route.get("/calculator", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/calculator");
});

route.get("/todolist", checkAuth, (req: Request, res: Response) => {
  res.render("singleTask/todo");
});

export default route;
