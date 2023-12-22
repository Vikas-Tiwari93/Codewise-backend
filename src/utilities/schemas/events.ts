import mongoose, { Model } from "mongoose";
import { assignmentSchema } from "./assignments";

const createStudentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    classes: [{ type: String, required: true }],
    type: { type: String, required: true },
    details: { type: String, required: true },
    date: { type: Date, required: true },
    isCancelled: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
export const Student = mongoose.model("Student", createStudentSchema);
