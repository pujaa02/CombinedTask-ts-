var jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    var token2 = req.cookies.token;
    const verified = jwt.verify(token2, process.env.JWT_SECRET_KEY);
    console.log(verified);
    if (verified) {
      next();
    } else {
      console.log("wrong");
      res.render("frontpage/login", { error: "something went wrong!!" });
    }
  } catch (error) {
    console.log("wrong error cetch");
    res.render("frontpage/login", { error: "something went wrong!!" });
  }
}
module.exports = checkAuth;

// var token = req.cookies.token;
// if (token) {
//   jwt.verify(token, process.env.JWT_SECRET_KEY),
//     (err) => {
//       if (err) {
//         res.render("frontpage/login", { error: "something went wrong!!" });
//       } else {
//         next();
//       }
//     };
// } else {
//   res.render("frontpage/login", { error: "something went wrong!!" });
// }
