import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: String,
    location: String,
    type: String, // consider enum in UI
    description: String,
    skills: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
