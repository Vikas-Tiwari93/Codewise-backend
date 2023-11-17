import mongoose from "mongoose";

export const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: String, required: true },
    deadline: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model("Assignments", assignmentSchema);
