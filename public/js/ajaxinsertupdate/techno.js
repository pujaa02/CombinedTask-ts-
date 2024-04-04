var con = require("../../../models/database");

function tech(req, res) {
  con.query(`select * from know_techno `, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}
module.exports = tech;
