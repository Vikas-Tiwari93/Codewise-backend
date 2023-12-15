import mongoose from "mongoose";

export const assignmentSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true },
    className: { type: String, required: true },
    assignmentId: { type: String, required: true },
    submissionAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model("Assignments", assignmentSchema);
