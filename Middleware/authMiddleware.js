const jwt = require("jsonwebtoken");
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check if jwt exists & is verified
  if (token) {
    const auth = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/admin/login");
        } else {
          console.log(decodedToken);
          next();
        }
      }
    );
  } else {
    res.redirect("/admin/login");
  }
};

module.exports = { requireAuth };
