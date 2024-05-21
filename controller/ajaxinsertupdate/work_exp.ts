import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function work_exp(req: Request, res: Response) {
  let query=await con.getall(`select * from work_experience`) as Array<RowDataPacket>;
  res.json(query);
}
export default work_exp;
