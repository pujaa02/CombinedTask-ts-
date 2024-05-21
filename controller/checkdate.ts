import con from "../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

function checkmail(req: Request, res: Response) {
  
  con.query(
    `select * from login where email='${req.query.email}'`,
    async function (err:Error, result:Array<RowDataPacket>) {
      if (err) throw err;
      const data:Array<RowDataPacket>= await result;
      res.json(data);
    }
  );
}

export default checkmail;
