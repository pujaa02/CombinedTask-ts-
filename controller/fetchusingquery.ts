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

  let search: string = jsonData["query"];

  let perPage: number = 20;
  let page: number = parseInt(req.query.page as string) || 1;
  const offset: number = (page - 1) * perPage;

  if (search === "") {
    res.send("Please Write Query First");
  } else if (
    search.startsWith("delete") ||
    search.startsWith("update") ||
    search.startsWith("drop")
  ) {
    res.send("Please write only select query");
  } else if (search.search("limit") > 1) {
    let q: string = `${search}`;

    try {
      let result = await con.getall(q, [offset, perPage]) as Array<RowDataPacket>

      let fields2: string[] = [];

      Object.keys(result[0]).forEach(key => {
        fields2.push(key);
      })

      res.render("taskzero/nolimit", { users: result, field: fields2 });
    } catch (error) {
      res.render("taskzero/home2", { error: error });
    }
  } else {
    let str: string = search;
    str = str.replace(";", " Limit ?,? ;");
    let q: string = `${str}`;
    let q2: string = `${search}`;

    try {
      let result2 = await con.query(q2) as Array<RowDataPacket>;
      let result3 = await con.getall(q, [offset, perPage]) as Array<RowDataPacket>;

      let fields: string[] = [];

      Object.keys(result3[0]).forEach(key => {
        fields.push(key);
      })

      res.render("taskzero/data", {
        users: result3,
        field: fields,
        page,
        search,
        len: result2,
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
    let search: string = req.params.query;
    let page: number = parseInt(req.params.page);

    let perPage: number = 20;
    const offset: number = (page - 1) * perPage;

    let sql: string = search;
    sql = sql.replace(";", " Limit ?,? ;");
    let q: string = `${sql}`;
    let q2: string = `${search}`;

    let result4 = await con.getall(q2) as Array<RowDataPacket>;
    let result5 = await con.getall(q, [offset, perPage]) as Array<RowDataPacket>;

    let fields2: string[] = [];

    Object.keys(result5[0]).forEach(key => {
      fields2.push(key);
    })

    res.render("taskzero/data", {
      users: result5,
      field: fields2,
      search,
      page,
      len: result4,
    });
  }
);

export default route;
