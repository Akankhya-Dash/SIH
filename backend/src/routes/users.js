import express from "express";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id email name role avatarUrl createdAt");
  res.json({ user });
});

router.patch("/me", authRequired, async (req, res) => {
  const { name, avatarUrl } = req.body || {};
  const updated = await User.findByIdAndUpdate(req.user.id, { $set: { name, avatarUrl } }, { new: true })
    .select("_id email name role avatarUrl createdAt");
  res.json({ user: updated });
});

export default router;
