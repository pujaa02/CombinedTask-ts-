var con = require("../../../models/database");

function emp_det(req, res) {
 

  con.query(`select * from emp_details `, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}
module.exports = emp_det;