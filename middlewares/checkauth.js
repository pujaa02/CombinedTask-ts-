var jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    var token2 = req.cookies.token;
    const verified = jwt.verify(token2, process.env.JWT_SECRET_KEY);

    if (verified) {
      next();
    } else {

      res.render("frontpage/login", { error: "something went wrong!!" });
    }
  } catch (error) {
 
    res.render("frontpage/login", { error: "something went wrong!!" });
  }
}
module.exports = checkAuth;
