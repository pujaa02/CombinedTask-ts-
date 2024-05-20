
import mysql  from 'mysql2';
import dotenv from "dotenv";
dotenv.config();
const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  dateStrings: true,
});
con.connect((err) => {
  if (err) throw err;
  console.log("connected!!");
});

export default con;
