import express from "express";
import Announcement from "../models/Announcement.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { ROLES } from "../types.js";
import { parsePagination, buildPage } from "../utills/paginator.js";

const router = express.Router();

router.post("/", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const { title, body } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: "title & body required" });
  const a = await Announcement.create({ collegeId: req.user.id, title, body });
  res.status(201).json({ announcement: a });
});

router.get("/", async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const match = {};
  if (req.query.collegeId) match.collegeId = req.query.collegeId;
  const [items, total] = await Promise.all([
    Announcement.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Announcement.countDocuments(match)
  ]);
  res.json(buildPage({ items, page, limit, total }));
});

router.patch("/:id", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) return res.status(404).json({ error: "Not found" });
  if (String(a.collegeId) !== String(req.user.id)) return res.status(403).json({ error: "Forbidden" });
  const allowed = ["title", "body"];
  for (const k of allowed) if (k in req.body) a[k] = req.body[k];
  await a.save();
  res.json({ announcement: a });
});

router.delete("/:id", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) return res.status(404).json({ error: "Not found" });
  if (String(a.collegeId) !== String(req.user.id)) return res.status(403).json({ error: "Forbidden" });
  await a.deleteOne();
  res.json({ ok: true });
});

export default router;
