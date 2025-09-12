import express from "express";
import College from "../models/College.js";
import CollegeAdmin from "../models/CollegeAdmin.js";
import AlumniProfile from "../models/AlumniProfile.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { ROLES } from "../types.js";

const router = express.Router();

// GET college by id
router.get("/:id", async (req, res) => {
  const col = await College.findById(req.params.id);
  if (!col) return res.status(404).json({ error: "Not found" });
  res.json({ college: col });
});

// PATCH college (college admin only)
router.patch("/:id", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  // ensure caller is admin of that college
  const admin = await CollegeAdmin.findOne({ userId: req.user.id, collegeId: req.params.id });
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  const col = await College.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true });
  res.json({ college: col });
});

// Link/unlink alumni to college
router.post("/:id/alumni/:alumniUserId", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const admin = await CollegeAdmin.findOne({ userId: req.user.id, collegeId: req.params.id });
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  const link = !!req.body.link;
  const profile = await AlumniProfile.findOneAndUpdate(
    { userId: req.params.alumniUserId },
    { $set: { collegeId: link ? req.params.id : null } },
    { new: true }
  );
  if (!profile) return res.status(404).json({ error: "alumni profile not found" });
  res.json({ profile });
});

export default router;
