import jwt      from "jsonwebtoken";
import User     from "../models/User.model.js";

// ── Generate JWT ─────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// ── Register ─────────────────────────────────────────────────
// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, targetCompanies } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, targetCompanies });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── Login ─────────────────────────────────────────────────────
// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── Get current user ─────────────────────────────────────────
// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── Update profile ────────────────────────────────────────────
// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, targetCompanies, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, targetCompanies, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── Change password ───────────────────────────────────────────
// PUT /api/auth/password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
