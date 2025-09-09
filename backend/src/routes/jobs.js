import express from "express";
import Job from "../models/Job.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { ROLES } from "../types.js";
import { parsePagination, buildPage } from "../utills/paginator.js";

const router = express.Router();

// Create job (alumni)
router.post("/", authRequired, requireRole(ROLES.ALUMNI), async (req, res) => {
  const { title, company = "", location = "", type = "full-time", description = "", skills = [] } = req.body || {};
  if (!title) return res.status(400).json({ error: "title required" });
  const job = await Job.create({ alumniId: req.user.id, title, company, location, type, description, skills });
  res.status(201).json({ job });
});

// List jobs
router.get("/", async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { alumniId, q } = req.query;
  const match = {};
  if (alumniId) match.alumniId = alumniId;
  if (q) {
    match.$or = [
      { title: { $regex: new RegExp(q, "i") } },
      { company: { $regex: new RegExp(q, "i") } },
      { location: { $regex: new RegExp(q, "i") } }
    ];
  }

  const [items, total] = await Promise.all([
    Job.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(match)
  ]);

  res.json(buildPage({ items, page, limit, total }));
});

// Update (owner)
router.patch("/:id", authRequired, requireRole(ROLES.ALUMNI), async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Not found" });
  if (String(job.alumniId) !== String(req.user.id)) return res.status(403).json({ error: "Forbidden" });
  const allowed = ["title", "company", "location", "type", "description", "skills"];
  for (const k of allowed) if (k in req.body) job[k] = req.body[k];
  await job.save();
  res.json({ job });
});

// Delete (owner)
router.delete("/:id", authRequired, requireRole(ROLES.ALUMNI), async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Not found" });
  if (String(job.alumniId) !== String(req.user.id)) return res.status(403).json({ error: "Forbidden" });
  await job.deleteOne();
  res.json({ ok: true });
});

export default router;
