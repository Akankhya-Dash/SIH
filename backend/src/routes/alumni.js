import express from "express";
import AlumniProfile from "../models/AlumniProfile.js";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";
import requireRole from "../middleware/requireRole.js";
import { parsePagination, buildPage } from "../utills/paginator.js";
import { ROLES } from "../types.js";

const router = express.Router();

// GET alumni/:id (public)
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("_id name email role avatarUrl");
  if (!user || user.role !== ROLES.ALUMNI) return res.status(404).json({ error: "Not found" });
  const profile = await AlumniProfile.findOne({ userId: user._id });
  res.json({ user, profile });
});

// PATCH alumni/:id (owner only)
router.patch("/:id", authRequired, requireRole(ROLES.ALUMNI), async (req, res) => {
  if (req.user.id !== req.params.id) return res.status(403).json({ error: "Forbidden" });
  const allowed = ["industries", "skills", "company", "title", "gradYear", "mentorshipOpen", "collegeId"];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
  const profile = await AlumniProfile.findOneAndUpdate({ userId: req.user.id }, { $set: updates }, { new: true, upsert: true });
  res.json({ profile });
});

// SEARCH /alumni/search?name=&skill=&industry=&year=&page=&limit=
router.get("/",
  async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { name = "", skill = "", industry = "", year } = req.query;

    const userMatch = { role: ROLES.ALUMNI };
    if (name) userMatch.name = { $regex: new RegExp(name, "i") };

    const profileMatch = {};
    if (skill) profileMatch.skills = { $in: [new RegExp(skill, "i")] };
    if (industry) profileMatch.industries = { $in: [new RegExp(industry, "i")] };
    if (year) profileMatch.gradYear = Number(year);

    // join users + profiles
    const pipeline = [
      { $match: userMatch },
      { $lookup: { from: "alumniprofiles", localField: "_id", foreignField: "userId", as: "profile" } },
      { $unwind: "$profile" },
      { $match: profileMatch },
      { $sort: { "profile.mentorshipOpen": -1, createdAt: -1 } },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }]
        }
      }
    ];

    const result = await User.aggregate(pipeline);
    const items = (result[0]?.items || []).map(({ passwordHash, ...rest }) => rest);
    const total = result[0]?.total?.[0]?.count || 0;
    res.json(buildPage({ items, page, limit, total }));
  }
);

export default router;
