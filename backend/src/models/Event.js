import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    location: String,
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
