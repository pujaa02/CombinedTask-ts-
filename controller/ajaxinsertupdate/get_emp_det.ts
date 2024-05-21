import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function emp_det(req: Request, res: Response) {
  let query=await con.getall(`select * from emp_details`) as Array<RowDataPacket>;
  res.json(query);
}
export default emp_det;