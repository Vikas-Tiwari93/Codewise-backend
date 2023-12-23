import mongoose, { Model } from "mongoose";
import { assignmentSchema } from "./assignments";

const projectsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    organisationId: { type: String, required: true },
    class: { type: String, required: true },
    projectId: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    phaseDetails: [
      {
        phaseOne: { type: String, required: true },
        pointers: [{ type: String, required: true }],
        timeLimit: { type: String, required: true },
        targetAchieved: { type: String, required: true },
        isApproved: { type: Boolean, required: true },
      },
    ],
    timeLimit: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export const Projects = mongoose.model("Projects", projectsSchema);
