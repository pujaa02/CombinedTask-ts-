import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";

import parser from "body-parser";
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
    con.query(q, [offset, perPage], (err, result, field) => {
      if (err) {
        res.render("taskzero/home2", { error: err });
      } else {
        res.render("taskzero/nolimit", { users: result, field: field });
      }
    });
  } else {
    let str = search;
    str = str.replace(";", " Limit ?,? ;");
    let q = `${str}`;
    let q2 = `${search}`;

    con.query(q2, (err, ans) => {
      if (err) {
        res.render("taskzero/home2", { error: err });
      } else {
        con.query(q, [offset, perPage], (err, result, field) => {
          if (err) {
            res.render("home2", { error: err });
          } else {
            res.render("taskzero/data", {
              users: result,
              field: field,
              page,
              search,
              len: ans,
            });
          }
        });
      }
    });
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

    con.query(q2, (err, ans) => {
      if (err) throw err;
      con.query(q, [offset, perPage], (err, result, field) => {
        if (err) throw err;

        res.render("taskzero/data", {
          users: result,
          field: field,
          search,
          page,
          len: ans,
        });
      });
    });
  }
);

export default route;
