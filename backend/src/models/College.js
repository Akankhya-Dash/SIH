import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("College", collegeSchema);
