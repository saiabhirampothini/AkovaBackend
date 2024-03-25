const jwt = require("jsonwebtoken");
// const config = require("config");
const jwtSecret="tshrieseilseaesleacsraeitatbohkiernadm/onteventrytobreach";
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(400)
      .json({ msg: "No token detected, authorization denied" });
  } else {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(400).json({ msg: "Token is invalid" });
    }
  }
};
module.exports = auth;
