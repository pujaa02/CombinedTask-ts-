var con = require("../../../models/database");

function get_cities(req, res) {
  con.query(`select * from cities`, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}

module.exports = get_cities;
