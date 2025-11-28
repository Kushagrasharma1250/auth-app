const User = require('../models/user.model');
const { signAccessToken, signRefreshToken, verifyToken } = require('../utils/tokens');

function setAuthCookies(res, accessToken, refreshToken) {
  const secure = process.env.COOKIE_SECURE === 'true';
  const sameSite = process.env.COOKIE_SAME_SITE || 'lax';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing required fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ email, password, name });

    const payload = { sub: user._id.toString(), email: user.email, roles: user.roles };
    const accessToken = signAccessToken(payload, process.env.JWT_ACCESS_SECRET, process.env.ACCESS_TOKEN_TTL);
    const refreshToken = signRefreshToken(payload, process.env.JWT_REFRESH_SECRET, process.env.REFRESH_TOKEN_TTL);

    setAuthCookies(res, accessToken, refreshToken);
    return res.status(201).json({ message: 'Registered successfully', user: { id: user._id, email, name, roles: user.roles } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { sub: user._id.toString(), email: user.email, roles: user.roles };
    const accessToken = signAccessToken(payload, process.env.JWT_ACCESS_SECRET, process.env.ACCESS_TOKEN_TTL);
    const refreshToken = signRefreshToken(payload, process.env.JWT_REFRESH_SECRET, process.env.REFRESH_TOKEN_TTL);

    setAuthCookies(res, accessToken, refreshToken);
    return res.json({ message: 'Logged in', user: { id: user._id, email: user.email, name: user.name, roles: user.roles } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid refresh token' });

    const payload = { sub: decoded.sub, email: decoded.email, roles: decoded.roles };
    const accessToken = signAccessToken(payload, process.env.JWT_ACCESS_SECRET, process.env.ACCESS_TOKEN_TTL);
    const newRefreshToken = signRefreshToken(payload, process.env.JWT_REFRESH_SECRET, process.env.REFRESH_TOKEN_TTL);

    setAuthCookies(res, accessToken, newRefreshToken);

    return res.json({ message: 'Token refreshed' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logout = async (_req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out' });
};