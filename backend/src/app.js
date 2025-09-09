import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { notFound, errorHandler } from "./utills/errors.js";
import { withCookies, authOptional } from "./middleware/auth.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import alumniRoutes from "./routes/alumni.js";
import studentRoutes from "./routes/students.js";
import mentorshipRoutes from "./routes/mentorship.js";
import jobsRoutes from "./routes/jobs.js";
import eventsRoutes from "./routes/events.js";
import announcementsRoutes from "./routes/announcements.js";
import collegesRoutes from "./routes/college.js";

const app = express();

// security & basics
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
withCookies(app);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// rate limit auth & search
const authLimiter = rateLimit({ windowMs: 60_000, max: 20 });
app.use("/auth", authLimiter);

// attach user if token exists
app.use(authOptional);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/alumni", alumniRoutes);
app.use("/students", studentRoutes);
app.use("/mentorship", mentorshipRoutes);
app.use("/jobs", jobsRoutes);
app.use("/events", eventsRoutes);
app.use("/announcements", announcementsRoutes);
app.use("/colleges", collegesRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
