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

function tech(req, res) {
  con.query(`select * from know_techno `, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}
module.exports = tech;
