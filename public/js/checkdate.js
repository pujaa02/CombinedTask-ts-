var con = require("../../models/database");

function checkmail(req, res) {
  // console.log(req.query.email);
  con.query(
    `select * from login where email='${req.query.email}'`,
    function (err, result) {
      if (err) throw err;
      data = result;
      // console.log("result", result);
      res.json(data);
    }
  );
}

module.exports = checkmail;
