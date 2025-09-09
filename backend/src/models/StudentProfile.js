import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    skills: { type: [String], default: [] },
    gradYear: Number,
    interests: { type: [String], default: [] },
    visibility: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
