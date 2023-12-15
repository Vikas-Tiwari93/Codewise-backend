import mongoose, { Model } from "mongoose";
import { assignmentSchema } from "./assignments";

const createClassSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true },
    classId: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    students: [
      {
        name: { type: String, required: true },
        profilePic: { type: String, required: true },
        weakness: [{ type: String, required: true }],
        totalAssignments: { type: Number, required: true },
        doneAssignments: { type: Number, required: true },
      },
    ],

    assignments: [
      {
        title: { type: String, required: true },
        assignmentId: { type: String, required: true },
        details: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],

    events: [
      {
        title: { type: String, required: true },
        details: { type: String, required: true },
        atDate: { type: String, required: true },
      },
    ],
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
createClassSchema.index({ classId: 1 }, { unique: true });
createClassSchema.index({ adminId: 1, className: 1 }, { unique: true });
export const Student = mongoose.model("Student", createClassSchema);
