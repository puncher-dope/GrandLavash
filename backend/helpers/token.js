const jwt = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
  },
  verifyRefreshToken: (token) => {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  },
};
