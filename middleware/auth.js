const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  //checks to see if token exists
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token was found" });
  }

  try {
    //checks to see if the token is valid
    const decoded = jwt.verify(token, config.get("JWT_SECRET"));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json("Token is not valid");
  }
};
