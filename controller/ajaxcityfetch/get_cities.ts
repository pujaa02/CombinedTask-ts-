import { RowDataPacket } from "mysql2";
import con from "../../models/database"
import { Request, Response } from "express";

function get_cities(req: Request, res: Response) {
  con.query(`select * from cities`, async function (err:Error, result:Array<RowDataPacket>) {
    if (err) throw err;
    const data:Array<RowDataPacket>= await result;
    res.json(data);
  });
}

export default get_cities;
