import mongoose from "mongoose";

const collegeAdminSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("CollegeAdmin", collegeAdminSchema);
