import mongoose, { Model } from "mongoose";
import { createAssignmentSchema } from "./assignments";

const createStudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    organisationId: { type: String, required: true },
    organisationName: { type: String, required: true },
    attachment: { type: String, required: true },
    isAgreement: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    authToken: { type: String, required: true },
    Assignments: [createAssignmentSchema],
  },
  {
    timestamps: true,
  }
);
export const Student = mongoose.model("Student", createStudentSchema);
