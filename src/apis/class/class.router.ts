import express from "express";
import {
  addNewClass,
  deleteClass,
  getClassDetails,
  updateCLassDetails,
} from "./class.controller";
import { isAuth } from "../../utilities/tokenGenerators/jwt";
export const ClassRouter = express.Router();
ClassRouter.get("/details", isAuth, getClassDetails);
ClassRouter.post("/add", isAuth, addNewClass);
ClassRouter.put("/update", isAuth, updateCLassDetails);
ClassRouter.delete("/remove", isAuth, deleteClass);
