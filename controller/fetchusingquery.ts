import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";

import parser from "body-parser";
import { RowDataPacket } from "mysql2";
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));

route.get("/fetch", checkAuth, (req: Request, res: Response) => {
  res.render("taskzero/home");
});
route.post("/fetch", async function (req: Request, res: Response) {
  let jsonData = req.body;

  let search = jsonData["query"];

  let perPage = 20;
  let page = parseInt(req.query.page as string) || 1;
  const offset = (page - 1) * perPage;

  if (search === "") {
    res.send("Please Write Query First");
  } else if (
    search.startsWith("delete") ||
    search.startsWith("update") ||
    search.startsWith("drop")
  ) {
    res.send("Please write only select query");
  } else if (search.search("limit") > 1) {
    let q = `${search}`;

  try {
      let [rows,fields]=await con.getall(q,[offset,perPage]) as Array<RowDataPacket>
      res.render("taskzero/nolimit", { users: rows, field: fields });
    } catch (error) {
        res.render("taskzero/home2", { error:error });
  }
  } else {
    let str = search;
    str = str.replace(";", " Limit ?,? ;");
    let q = `${str}`;
    let q2 = `${search}`;

 try {
    let [rows1,fields1]=await con.getall(q2) as Array<RowDataPacket>;
    let [rows2,fields2]=await con.getall(q,[offset,perPage]) as Array<RowDataPacket>;
    res.render("taskzero/data", {
        users: rows2,
        field: fields2,
        page,
        search,
        len: rows1,
      });
 } catch (error) {
     res.render("taskzero/home2", { error: error });
 }
  }
});
route.get(
  "/fetchdata/:page/:query",
  checkAuth,
  async function (req: Request, res: Response) {
    let search = req.params.query;
    let page = parseInt(req.params.page);

    let perPage = 20;
    const offset = (page - 1) * perPage;

    let sql = search;
    sql = sql.replace(";", " Limit ?,? ;");
    let q = `${sql}`;
    let q2 = `${search}`;

        let [rows3,fields3]=await con.getall(q2) as Array<RowDataPacket>;
        let [rows4,fields4]=await con.getall(q,[offset,perPage]) as Array<RowDataPacket>;
        res.render("taskzero/data", {
            users: rows4,
            field: fields4,
            search,
            page,
            len: rows3,
          });
  }
);

export default route;
