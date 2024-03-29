var jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    var token = req.cookies.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (verified) {
      next();
    } else {
      console.log("wrong");
      res.render("frontpage/login", { error: "something went wrong!!" });
    }
  } catch (error) {
    console.log("wrong");
    res.render("frontpage/login", { error: "something went wrong!!" });
  }
}
module.exports = checkAuth;
