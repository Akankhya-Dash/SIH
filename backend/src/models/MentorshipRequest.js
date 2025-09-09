import mongoose from "mongoose";
import { MENTORSHIP_STATUS } from "../types.js";

const mentorshipRequestSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(MENTORSHIP_STATUS),
      default: MENTORSHIP_STATUS.PENDING
    },
    message: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("MentorshipRequest", mentorshipRequestSchema);
