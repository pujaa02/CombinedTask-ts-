import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function tech(req: Request, res: Response) {
  let query=await con.getall(`select * from know_techno`) as Array<RowDataPacket>;
  res.json(query);
}
export default tech;
