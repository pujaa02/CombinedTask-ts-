var con = require("../../models/database");

function checkmail(req, res) {
  
  con.query(
    `select * from login where email='${req.query.email}'`,
    function (err, result) {
      if (err) throw err;
      data = result;
     
      res.json(data);
    }
  );
}

module.exports = checkmail;
