import mongoose, { Model } from "mongoose";
import { assignmentSchema } from "./assignments";

const submissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    class: { type: String, required: true },
    assignmentId: { type: String, required: true },
    uploads: [
      {
        title: { type: String, required: true },
        path: { type: String, required: true },
        isReviewed: { type: Boolean, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Submission = mongoose.model("Submissions", submissionSchema);
