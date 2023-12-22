import mongoose, { Model } from "mongoose";
import { assignmentSchema } from "./assignments";

const createTopicsSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true },
    className: { type: String, required: true },
    title: { type: String, required: true },
    contentParagraph: [{ type: String, required: true }],
    isrestricted: { type: Boolean },
  },
  {
    timestamps: true,
  }
);
createTopicsSchema.index({ classId: 1 }, { unique: true });
export const createTopics = mongoose.model("Topics", createTopicsSchema);
