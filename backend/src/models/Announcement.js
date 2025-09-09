import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
