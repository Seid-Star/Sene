const jwt = require("jsonwebtoken");
const env = require("../config/env");

const OPTIONS = { algorithm: "HS256", issuer: "sene-api" };
const generateToken = (user) =>
  jwt.sign({ sub: user.id, tv: user.tokenVersion }, env.JWT_SECRET, {
    ...OPTIONS,
    expiresIn: env.JWT_EXPIRES_IN,
  });

const verifyToken = (token) =>
  jwt.verify(token, env.JWT_SECRET, {
    algorithms: [OPTIONS.algorithm],
    issuer: OPTIONS.issuer,
  });

module.exports = { generateToken, verifyToken };
