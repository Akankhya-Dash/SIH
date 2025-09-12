import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import AlumniProfile from "../models/AlumniProfile.js";
import College from "../models/College.js";
import CollegeAdmin from "../models/CollegeAdmin.js";
import {
  signAccess,
  signRefresh,
  setAuthCookies,
  clearAuthCookies,
  verifyRefresh
} from "../utills/jwt.js";
import { ROLES } from "../types.js";

const router = express.Router();

// Small helper to normalize errors back to client
function bad(res, status, msg) {
  return res.status(status).json({ error: msg });
}

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name = "", role = ROLES.STUDENT, collegeName } = req.body || {};
    if (!email || !password) return bad(res, 400, "email & password required");
    if (!Object.values(ROLES).includes(role)) return bad(res, 400, "invalid role");

    const existing = await User.findOne({ email });
    if (existing) return bad(res, 400, "email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role });

    // create profile/admin mapping based on role
    if (role === ROLES.STUDENT) {
      await StudentProfile.create({
        userId: user._id,
        skills: [],
        interests: [],
        visibility: true
      });
    } else if (role === ROLES.ALUMNI) {
      await AlumniProfile.create({
        userId: user._id,
        skills: [],
        industries: [],
        mentorshipOpen: true
      });
    } else if (role === ROLES.COLLEGE) {
      const college = await College.create({ name: collegeName || "My College" });
      await CollegeAdmin.create({ collegeId: college._id, userId: user._id });
    }

    const accessToken = signAccess({ id: user._id, role: user.role });
    const refreshToken = signRefresh({ id: user._id, role: user.role });
    setAuthCookies(res, { accessToken, refreshToken });

    res.status(201).json({
      message: "signed up",
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return bad(res, 500, "internal error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return bad(res, 400, "email & password required");
    const user = await User.findOne({ email });
    if (!user) return bad(res, 401, "invalid credentials");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return bad(res, 401, "invalid credentials");

    const accessToken = signAccess({ id: user._id, role: user.role });
    const refreshToken = signRefresh({ id: user._id, role: user.role });
    setAuthCookies(res, { accessToken, refreshToken });
    res.json({
      message: "logged in",
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return bad(res, 500, "internal error");
  }
});

// REFRESH
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME_REF];
    if (!token) return bad(res, 401, "no refresh token");
    const payload = verifyRefresh(token);
    const accessToken = signAccess({ id: payload.id, role: payload.role });
    setAuthCookies(res, { accessToken });
    res.json({ ok: true });
  } catch (err) {
    console.error("Refresh error:", err.message);
    return bad(res, 401, "invalid refresh token");
  }
});

// LOGOUT
router.post("/logout", (_req, res) => {
  clearAuthCookies(res);
  res.json({ message: "logged out" });
});

export default router;
