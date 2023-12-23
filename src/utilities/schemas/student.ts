import mongoose, { Model } from "mongoose";
import { assignmentSchema } from "./assignments";

const createStudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true },
    organisation: [
      {
        orgName: { type: String, required: true },
        orgId: { type: String, required: true },
      },
    ],
    attachment: { type: String },
    isAgreement: { type: Boolean },
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    assignments: [
      {
        adminId: { type: String, required: true },
        assignmentId: { type: String, required: true },
        assignmentTitle: { type: String, required: true },
        assignmentDetails: { type: String, required: true },
      },
    ],
    projects: [
      {
        adminId: { type: String, required: true },
        assignmentId: { type: String, required: true },
        assignmentTitle: { type: String, required: true },
      },
    ],
    challenges: [
      {
        adminId: { type: String, required: true },
        challengesId: { type: String, required: true },
        challengesTitle: { type: String, required: true },
        difficulty: { type: String, required: true },
      },
    ],
    classes: [
      {
        adminId: { type: String, required: true },
        classId: { type: String, required: true },
        className: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Student = mongoose.model("Student", createStudentSchema);
