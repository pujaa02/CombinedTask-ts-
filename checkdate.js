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
  // console.log("connected!!");
});

function checkmail(req, res) {
  console.log(req.query.email);
  con.query(
    `select * from login where email='${req.query.email}'`,
    function (err, result) {
      if (err) throw err;
      data = result;
      console.log("result", result);
      res.json(data);
    }
  );
}

module.exports = checkmail;
