import mongoose from "mongoose";

export const createAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, required: true },
  deadLine: { type: String, required: true },
  attachments: [{ type: String, required: true }],
});

export const AssignmentSchema = mongoose.model(
  "Assignments",
  createAssignmentSchema
);
