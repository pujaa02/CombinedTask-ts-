
import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function lan(req: Request, res: Response) {
  let query=await con.getall(`select * from language`) as Array<RowDataPacket>;
  res.json(query);
}
export default lan;