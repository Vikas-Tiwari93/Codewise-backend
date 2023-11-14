import mongoose, { Model } from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  attachments: [String], // Array of file paths for image attachments
  isAssignmentDone: Boolean,
});
const studentSchema = new mongoose.Schema({
  studentName: String,
  assignments: [assignmentSchema], // Array of Assignment documents
});

const classSchema = new mongoose.Schema({
  className: String,
  classId: String,
  students: [studentSchema], // Array of Student documents
});
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: true },
    organisationId: { type: String, required: true },
    organisationName: { type: String, required: true },
    attachment: { type: String, required: true },
    isAgreement: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    authToken: { type: String, required: true },
    classes: [classSchema], // on creating a class thus not required
  },
  {
    timestamps: true,
  }
);
// defining types

export const Admin = mongoose.model("Admin", adminSchema);
