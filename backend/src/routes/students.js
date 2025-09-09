import express from "express";
import StudentProfile from "../models/StudentProfile.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { ROLES } from "../types.js";

const router = express.Router();

router.get("/:id", authRequired, async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.params.id });
  if (!profile) return res.status(404).json({ error: "Not found" });
  res.json({ profile });
});

router.patch("/:id", authRequired, requireRole(ROLES.STUDENT), async (req, res) => {
  if (req.user.id !== req.params.id) return res.status(403).json({ error: "Forbidden" });
  const allowed = ["skills", "gradYear", "interests", "visibility"];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
  const profile = await StudentProfile.findOneAndUpdate({ userId: req.user.id }, { $set: updates }, { new: true, upsert: true });
  res.json({ profile });
});

export default router;
