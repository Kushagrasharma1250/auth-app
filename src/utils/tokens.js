const jwt = require('jsonwebtoken');

exports.signAccessToken = (payload, secret, expiresIn = '15m') => {
  return jwt.sign(payload, secret, { expiresIn });
};

exports.signRefreshToken = (payload, secret, expiresIn = '7d') => {
  return jwt.sign(payload, secret, { expiresIn });
};

exports.verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
