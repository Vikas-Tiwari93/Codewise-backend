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
import {
  RequestWithUser,
  generateJwtTokens,
  updatingJwtTokensInDb,
} from "../../../utilities/tokenGenerators/jwt";
import { secretKey } from "../../../utilities/constants/keys";
import { isPasswordVerified } from "../../../utilities/otherMiddlewares/password";
import { Users } from "../../../utilities/schemas/users";

export const SigninController = async (
  req: ValidatedRequest<SigninRequestSchema>,
  res: Response
) => {
  const { userName, password, role } = req.body;

  try {
    const { authToken, refreshToken } = generateJwtTokens({
      userName,
      role,
    });

    const user = await updatingJwtTokensInDb(authToken, {
      userName,
      role,
    });

    if (
      user?.hasData &&
      (await isPasswordVerified(password, user?.resultSet?.password))
    ) {
      return res.status(200).json({
        isAdmin: user?.resultSet.isAdmin,
        authToken,
        refreshToken,
        message: "SignIn Complete",
      });
    }
    return res.status(404).json({ message: "Invalid Credentials" });
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error signing in user" });
  }
};

export const generateAuthTokenController = async (
  req: RequestWithUser,
  res: Response
) => {
  const { refreshToken } = req.body;
  const user = req.user;
  try {
    if (user) {
      const querypayload = { userName: user.userName, role: user.userName };
      const identifyUser = await getRecordDetails(Users, querypayload);

      if (!identifyUser) {
        return res.status(404).send("User not found");
      }
      const { authToken, refreshToken } = generateJwtTokens(user);
      await updatingJwtTokensInDb(authToken, user);

      res
        .status(200)
        .send({ authToken, refreshToken, message: "authToken sent" });
      return res.status(404).send("Refresh token expired");
    }
  } catch (error) {
    res.status(403).send("Authentication failed");
  }
};
