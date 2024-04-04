var con = require("../../../models/database");

function edu_det(req, res) {
  con.query(`select * from edu_detail `, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}
module.exports = edu_det;
