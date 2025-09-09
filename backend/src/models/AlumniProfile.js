import mongoose from "mongoose";

const alumniProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    industries: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    company: String,
    title: String,
    gradYear: Number,
    mentorshipOpen: { type: Boolean, default: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" } // optional link
  },
  { timestamps: true }
);

export default mongoose.model("AlumniProfile", alumniProfileSchema);
