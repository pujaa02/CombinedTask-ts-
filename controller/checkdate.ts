import con from "../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function checkmail(req: Request, res: Response) {
  let query=await con.getall(`select * from login where email='${req.query.email}'`) as Array<RowDataPacket>;
  res.json(query);
}

export default checkmail;
