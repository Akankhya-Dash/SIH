import express from "express";
import Event from "../models/Event.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { ROLES } from "../types.js";

const router = express.Router();

// Create event (college)
router.post("/", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const { title, startsAt, endsAt, location = "", description = "" } = req.body || {};
  if (!title || !startsAt || !endsAt) return res.status(400).json({ error: "title, startsAt, endsAt required" });
  const event = await Event.create({ collegeId: req.user.id, title, startsAt, endsAt, location, description });
  res.status(201).json({ event });
});

// List events (?collegeId=&upcoming=true)
router.get("/", async (req, res) => {
  const match = {};
  if (req.query.collegeId) match.collegeId = req.query.collegeId;
  if (req.query.upcoming === "true") match.startsAt = { $gte: new Date() };
  const items = await Event.find(match).sort({ startsAt: 1 });
  res.json({ data: items });
});

// Update / Delete (owner = college)
router.patch("/:id", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ error: "Not found" });
  if (String(ev.collegeId) !== String(req.user.id)) return res.status(403).json({ error: "Forbidden" });
  const allowed = ["title", "startsAt", "endsAt", "location", "description"];
  for (const k of allowed) if (k in req.body) ev[k] = req.body[k];
  await ev.save();
  res.json({ event: ev });
});

router.delete("/:id", authRequired, requireRole(ROLES.COLLEGE), async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ error: "Not found" });
  if (String(ev.collegeId) !== String(req.user.id)) return res.status(403).json({ error: "Forbidden" });
  await ev.deleteOne();
  res.json({ ok: true });
});

export default router;
