import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../src/models/User.js";
import StudentProfile from "../src/models/StudentProfile.js";
import AlumniProfile from "../src/models/AlumniProfile.js";
import College from "../src/models/College.js";
import CollegeAdmin from "./src/models/CollegeAdmin.js";
import Job from "../src/models/Job.js";
import Event from "../src/models/Event.js";
import Announcement from "../src/models/Announcement.js";
import { ROLES } from "../src/types.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    AlumniProfile.deleteMany({}),
    College.deleteMany({}),
    CollegeAdmin.deleteMany({}),
    Job.deleteMany({}),
    Event.deleteMany({}),
    Announcement.deleteMany({})
  ]);

  const pwd = await bcrypt.hash("password123", 10);

  const student = await User.create({ email: "student@test.com", passwordHash: pwd, name: "Student One", role: ROLES.STUDENT });
  const alumni = await User.create({ email: "alumni@test.com", passwordHash: pwd, name: "Alumni One", role: ROLES.ALUMNI });
  const collegeAdmin = await User.create({ email: "college@test.com", passwordHash: pwd, name: "College Admin", role: ROLES.COLLEGE });

  await StudentProfile.create({
    userId: student._id,
    skills: ["javascript", "html"],
    interests: ["frontend", "ui"],
    gradYear: 2025,
    visibility: true
  });

  const college = await College.create({ name: "Example College" });
  await CollegeAdmin.create({ collegeId: college._id, userId: collegeAdmin._id });

  await AlumniProfile.create({
    userId: alumni._id,
    industries: ["Software"],
    skills: ["react", "node", "mentoring"],
    company: "Tech Co",
    title: "Senior Engineer",
    gradYear: 2018,
    mentorshipOpen: true,
    collegeId: college._id
  });

  // a couple of jobs
  await Job.create([
    { alumniId: alumni._id, title: "Frontend Developer", company: "Tech Co", location: "Remote", type: "full-time", description: "React+TS", skills: ["react", "typescript"] },
    { alumniId: alumni._id, title: "Intern Frontend", company: "Tech Co", location: "Remote", type: "internship", description: "Learn React", skills: ["react"] }
  ]);

  // event + announcement
  const now = new Date();
  await Event.create({
    collegeId: collegeAdmin._id,
    title: "Campus Career Fair",
    startsAt: new Date(now.getTime() + 7 * 86400e3),
    endsAt: new Date(now.getTime() + 7 * 86400e3 + 2 * 3600e3),
    location: "Main Hall",
    description: "Meet companies"
  });

  await Announcement.create({
    collegeId: collegeAdmin._id,
    title: "Welcome Back!",
    body: "New semester starts next week."
  });

  console.log("✅ Seed complete");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
