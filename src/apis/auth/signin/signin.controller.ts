import jwt from "jsonwebtoken";
import { SininTypeRequest } from "../auth.types";
import {
  SERVER_ERROR,
  SUCCESS,
} from "../../../utilities/constants/http-constants";
import {
  getRecordDetails,
  updateRecord,
} from "../../../utilities/db/dbwrapper";
import { Request, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { SigninRequestSchema } from "./signin.validation";
import { Admin } from "../../../utilities/schemas/admin";
import { Student } from "../../../utilities/schemas/student";

const secretKey = "codewise";

export const SigninController = async (
  req: ValidatedRequest<SigninRequestSchema>,
  res: Response
) => {
  const { userName, password, isAdmin } = req.body;

  const query = { userName, password };
  try {
    const authToken = jwt.sign({ userName, password, isAdmin }, secretKey, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userName, password, isAdmin }, secretKey, {
      expiresIn: "7d",
    });
    const payload = { authToken: authToken };
    if (isAdmin) {
      const user = await updateRecord(Admin, query, payload);
      if (!user.hasData) {
        return res.status(SUCCESS).json({ message: "Invalid credentials" });
      }
    }
    if (!isAdmin) {
      const user = await updateRecord(Student, query, payload);
      if (!user.hasData) {
        return res.status(SUCCESS).json({ message: "Invalid credentials" });
      }
    }

    res.json({ authToken, refreshToken, message: "SignIn Complete" });
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error signing in user" });
  }
};
