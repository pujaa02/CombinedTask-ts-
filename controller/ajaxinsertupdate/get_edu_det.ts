import { RowDataPacket } from "mysql2";
import con from "../../models/database"
import { Request, Response } from "express";

async function edu_det(req: Request, res: Response) {
  let query=await con.getall(`select * from edu_detail`) as Array<RowDataPacket>;
  res.json(query);
}
export default edu_det;
