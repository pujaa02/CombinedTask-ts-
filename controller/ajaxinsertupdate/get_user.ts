import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

function get_user(req: Request, res: Response) {
  con.query(
    `select emp_id,fname,lname from emp_details`,
    async function (err:Error, result:Array<RowDataPacket>, fields) {
      if (err) throw err;
      const data:Array<RowDataPacket>= await result;
      res.json(data);
    }
  );
}
export default get_user;
