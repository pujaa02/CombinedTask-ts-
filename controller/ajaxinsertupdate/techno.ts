import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

function tech(req: Request, res: Response) {
  con.query(`select * from know_techno `, async function (err:Error, result:Array<RowDataPacket>, fields) {
    if (err) throw err;
    const data:Array<RowDataPacket>= await result;
    res.json(data);
  });
}
export default tech;
