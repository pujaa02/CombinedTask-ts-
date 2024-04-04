const route = require("express").Router();
var checkAuth = require("../middlewares/checkauth");
var con = require("../models/database");

var name;
route.get("/data", checkAuth, (req, res) => {
  if (req.query.field) {
    name = req.query.field;
  } else {
    name = "id";
  }
  const perPage = 200; // Number of items per page
  let page = parseInt(req.query.page) || 1; // Current page number

  // Calculate offset
  const offset = (page - 1) * perPage;
  //offset= (perPage * page) - perPage

  // Fetch data for current page
  con.query(
    `SELECT * FROM student_master26 order by ${name} LIMIT ?, ?`,
    [offset, perPage],
    (error, results) => {
      if (error) throw error;

      
      con.query("SELECT COUNT(*) AS count FROM student_master26", (error) => {
    
        if (error) throw error;
        res.render("order/orderpagination26", {
          users: results,
          page: page,
          field: req.query.field,
        });
      });
    }
  );
});

module.exports = route;
