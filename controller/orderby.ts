import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";
import { RowDataPacket } from "mysql2";

var name: string;
route.get("/data", checkAuth, async(req: Request, res: Response) => {
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
  let results=await con.getall(`SELECT * FROM student_master26 order by ${name} LIMIT ?, ?`,[offset,perPage]) as Array<RowDataPacket>;
  await con.getall("SELECT COUNT(*) AS count FROM student_master26")as Array<RowDataPacket>;
        res.render("order/orderpagination26", {
          users: results,
          page: page,
          field: req.query.field,
    }
  );
});
export default route;
