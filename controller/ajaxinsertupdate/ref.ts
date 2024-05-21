import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

function ref(req: Request, res: Response) {
  con.query(
    `select * from reference_contact`,
    async function (err:Error, result:Array<RowDataPacket>, fields) {
      if (err) throw err;
      const data:Array<RowDataPacket>= await result;
      res.json(data);
    }
  );
}
export default ref;
