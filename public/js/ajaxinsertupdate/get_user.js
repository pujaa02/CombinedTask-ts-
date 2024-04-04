var con = require("../../../models/database");

function get_user(req, res) {
  con.query(
    `select emp_id,fname,lname from emp_details`,
    async function (err, result, fields) {
      if (err) throw err;
      data = await result;
      res.json(data);
    }
  );
}
module.exports = get_user;
