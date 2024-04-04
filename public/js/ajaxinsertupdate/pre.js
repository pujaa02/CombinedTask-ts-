var con = require("../../../models/database");
function pre(req, res) {
  con.query(`select * from preferences`, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}
module.exports = pre;
