import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

async function get_user(req: Request, res: Response) {
  let query=await con.getall(`select emp_id,fname,lname from emp_details`) as Array<RowDataPacket>;
  res.json(query);
}
export default get_user;
