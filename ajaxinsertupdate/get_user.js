var mysql = require("mysql2");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@258",
  database: "main",
  dateStrings: "true",
});
con.connect((err) => {
  if (err) throw err;
  //   console.log("connected!!");
});

function get_user(req, res) {
  con.query(
    `select emp_id,fname,lname from emp_details`,
    async function (err, result, fields) {
      if (err) throw err;
      data = await result;
      res.json(data);
    }
  );
}
module.exports = get_user;
