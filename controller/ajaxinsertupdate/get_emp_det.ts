import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

function emp_det(req: Request, res: Response) {
 

  con.query(`select * from emp_details `, async function (err:Error, result:Array<RowDataPacket>, fields) {
    if (err) throw err;
    const data:Array<RowDataPacket>= await result;
    res.json(data);
  });
}
export default emp_det;