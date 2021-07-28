const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    // let token = req.headers.authorization || req.query.access_token || req.body.access_token
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }
    console.log("1");
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log("2");
    req.user = decoded;
    next();
  } catch (e) {
    console.log("lel");
    return res.status(401).json({ message: "No authorization" });
  }
};
