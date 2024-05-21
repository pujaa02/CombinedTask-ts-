import { RowDataPacket } from "mysql2";
import con from "../../models/database";
import { Request, Response } from "express";

async function get_state(req: Request, res: Response) {
    let query=await con.getall(`select * from states`) as Array<RowDataPacket>;
    res.json(query); 
}

export default get_state;
