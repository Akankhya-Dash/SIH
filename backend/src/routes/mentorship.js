import express from "express";
import MentorshipRequest from "../models/MentorshipRequest.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { MENTORSHIP_STATUS, ROLES } from "../types.js";
import { parsePagination, buildPage } from "../utills/paginator.js";

const router = express.Router();

// Create request (student -> alumni)
router.post("/requests", authRequired, requireRole(ROLES.STUDENT), async (req, res) => {
  const { alumniId, message = "" } = req.body || {};
  if (!alumniId) return res.status(400).json({ error: "alumniId required" });
  const reqDoc = await MentorshipRequest.create({
    studentId: req.user.id,
    alumniId,
    message,
    status: MENTORSHIP_STATUS.PENDING
  });
  res.status(201).json({ request: reqDoc });
});

// List requests for current user by role
router.get("/requests", authRequired, async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const status = req.query.status;
  const match = {};
  if (status) match.status = status;
  if (req.user.role === ROLES.STUDENT) match.studentId = req.user.id;
  else if (req.user.role === ROLES.ALUMNI) match.alumniId = req.user.id;

  const [items, total] = await Promise.all([
    MentorshipRequest.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MentorshipRequest.countDocuments(match)
  ]);

  res.json(buildPage({ items, page, limit, total }));
});

// Update status (alumni accepts/declines; either can complete)
router.patch("/requests/:id", authRequired, async (req, res) => {
  const { action } = req.body || {};
  const doc = await MentorshipRequest.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  if (action === "accept" || action === "decline") {
    if (req.user.role !== ROLES.ALUMNI || String(doc.alumniId) !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    doc.status = action === "accept" ? MENTORSHIP_STATUS.ACCEPTED : MENTORSHIP_STATUS.DECLINED;
  } else if (action === "complete") {
    if (![doc.alumniId.toString(), doc.studentId.toString()].includes(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    doc.status = MENTORSHIP_STATUS.COMPLETED;
  } else {
    return res.status(400).json({ error: "invalid action" });
  }

  await doc.save();
  res.json({ request: doc });
});

export default router;
