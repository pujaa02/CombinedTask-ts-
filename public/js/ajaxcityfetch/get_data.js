var con = require("../../../models/database");

function get_state(req, res) {
  con.query(`select * from states`, async function (err, result, fields) {
    if (err) throw err;
    data = await result;
    res.json(data);
  });
}

module.exports = get_state;
