import con from "../../models/database";
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function pre(req: Request, res: Response) {
  let query=await con.getall(`select * from preferences`) as Array<RowDataPacket>;
  res.json(query);
}
export default pre;
