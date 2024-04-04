var con = require("../../../models/database");

function work_exp(req, res) {
  con.query(
    `select * from work_experience `,
    async function (err, result, fields) {
      if (err) throw err;
      data = await result;
      res.json(data);
    }
  );
}
module.exports = work_exp;
