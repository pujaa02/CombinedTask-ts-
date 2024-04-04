var con = require("../../../models/database");

function ref(req, res) {
  con.query(
    `select * from reference_contact`,
    async function (err, result, fields) {
      if (err) throw err;
      data = await result;
      res.json(data);
    }
  );
}
module.exports = ref;
