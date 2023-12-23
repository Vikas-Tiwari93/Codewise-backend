import express from "express";

export const ClassRouter = express.Router();
ClassRouter.post("/accept", getClassDetails);
ClassRouter.post("/reject", addNewClass);
ClassRouter.post("/addstudent", updateCLassDetails);
ClassRouter.delete("/remove", deleteClass);
