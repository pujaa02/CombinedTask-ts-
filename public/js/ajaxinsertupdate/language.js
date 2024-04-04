
var con = require("../../../models/database");

function lan(req, res) {

  con.query(`select * from language`, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}
module.exports = lan;