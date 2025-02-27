const jwt = require("jsonwebtoken");
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "3d" });
}
function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "7d" });
}
module.exports = { generateToken, generateRefreshToken };
