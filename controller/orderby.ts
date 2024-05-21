import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";

var name: string;
route.get("/data", checkAuth, (req: Request, res: Response) => {
  let name: string;
  if (req.query.field) {
    name = req.query.field as string;
  } else {
    name = "id";
  }
  const perPage: number = 200; // Number of items per page
  let page: number = parseInt(req.query.page as string) || 1; // Current page number

  // Calculate offset
  const offset: number = (page - 1) * perPage;
  //offset= (perPage * page) - perPage

  // Fetch data for current page
  con.query(
    `SELECT * FROM student_master26 order by ${name} LIMIT ?, ?`,
    [offset, perPage],
    (error, results) => {
      if (error) throw error;

      con.query("SELECT COUNT(*) AS count FROM student_master26", (error) => {
        if (error) throw error;
        res.render("order/orderpagination26", {
          users: results,
          page: page,
          field: req.query.field,
        });
      });
    }
  );
});
export default route;
