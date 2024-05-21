import con from "../../models/database"
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

function get_state(req: Request, res: Response) {
  con.query(`select * from states`, async function (err:Error, result:Array<RowDataPacket>) {
    if (err) throw err;
    const data:Array<RowDataPacket>= await result;
    res.json(data);
  });
}

export default get_state;
