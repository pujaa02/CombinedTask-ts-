import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function ref(req: Request, res: Response) {
  let query=await con.getall(`select * from reference_contact`) as Array<RowDataPacket>;
  res.json(query);
}
export default ref;
