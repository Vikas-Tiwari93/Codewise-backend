import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BAD_REQUEST,
  SERVER_ERROR,
} from "../../../utilities/constants/http-constants";

import { createSingleRecord } from "../../../utilities/db/dblayer";
import { Admin } from "../../../utilities/schemas/admin";
import { Student } from "../../../utilities/schemas/student";
import { ValidatedRequest } from "express-joi-validation";
import { SignupAdminRequestSchema } from "./signup.validation";
import { getRecordDetails } from "../../../utilities/db/dbwrapper";
import { generateJwtTokens } from "../../../utilities/tokenGenerators/jwt";
import { handleImageUpload } from "../../../services/uploadsDownloads/imageUpload/image";
import { secretKey } from "../../../utilities/constants/keys";
import {
  makeDirectories,
  path,
} from "../../../utilities/initialservices/initialServices";
import { encryptPassword } from "../../../utilities/otherMiddlewares/password";
import { Users } from "../../../utilities/schemas/users";
import { createSingleRecordWithTransactions } from "../../../utilities/transations/dblayer";
import { executeOperationsInTransaction } from "../../../utilities/transations/transations.methods";
export const SignupControllerAdmin = async (
  req: ValidatedRequest<SignupAdminRequestSchema>,
  res: Response
) => {
  const {
    firstName,
    lastName,
    password,
    organisationName,
    organisationId,
    email,
    attachment,
    userName,
  } = req.body;

  const { authToken, refreshToken } = generateJwtTokens({
    userName,
    role: "admin",
  });

  const name = firstName + " " + lastName;
  const payload = {
    email,
    name,
    userName,
    password: await encryptPassword(password),
    role: "admin",
    organisation: [{ orgName: organisationName, orgId: organisationId }],
    attachment,
    isActive: true,
    isDeleted: false,
    authToken,
  };
  const adminPayload = {
    email,
    name,
    userId: userName,
    organisationName,
    organisationId,
    isActive: true,
    isDeleted: false,
  };
  try {
    const isAdminRegistered = await getRecordDetails(Users, {
      userName,
    });
    if (!isAdminRegistered.hasData) {
      let createUserOperations = [
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(Users, payload, session),
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(
            Admin,
            adminPayload,
            session
          ),
      ];
      const admin = await executeOperationsInTransaction(createUserOperations);
      const adminId =
        admin && admin.length > 1 ? admin[1].resultSet[0].userId : null;
      if (adminId) {
        res.json({ adminId, message: "User signed up successfully" });
      } else {
        res.status(BAD_REQUEST).json({ message: "Bad delete request" });
      }
    } else {
      res.json({ message: "Already have a user with these credentials" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error signing up user" });
  }
};
export const SignupControllerStudent = async (
  req: ValidatedRequest<SignupAdminRequestSchema>,
  res: Response
) => {
  const {
    firstName,
    lastName,
    password,
    organisationName,
    organisationId,
    email,
    attachment,
    userName,
  } = req.body;

  const { authToken, refreshToken } = generateJwtTokens({
    userName,
    role: "student",
  });

  const name = firstName + " " + lastName;
  const payload = {
    email,
    name,
    userName,
    password: await encryptPassword(password),
    role: "student",
    organisation: [{ orgName: organisationName, orgId: organisationId }],
    attachment,
    isActive: true,
    isDeleted: false,
    authToken,
  };
  const studentPayload = {
    email,
    name,
    userName,
    organisation: [{ orgName: organisationName, orgId: organisationId }],
    isActive: true,
    isDeleted: false,
  };
  try {
    const isStudentRegistered = await getRecordDetails(Users, {
      userName,
      password,
    });

    if (!isStudentRegistered.hasData) {
      console.log("wtf");
      let createUserOperations = [
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(Users, payload, session),
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(
            Student,
            studentPayload,
            session
          ),
      ];
      const student = await executeOperationsInTransaction(
        createUserOperations
      );
      const studentId = student ? student[1].resultSet[0].userName : null;
      if (studentId) {
        res.json({ studentId, message: "User signed up successfully" });
      } else {
        res.status(BAD_REQUEST).json({ message: "Bad request" });
      }
    } else {
      res.json({ message: "Already have a user with these credentials" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error signing up user" });
  }
};

export const uploadsController = async (req: Request, res: Response) => {
  const { uploadFile, saveAs } = handleImageUpload(req);

  if (uploadFile && saveAs) {
    uploadFile?.mv(`${path}+${saveAs}`, function (err: unknown) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json({ status: "uploaded", saveAs });
    });
  }

  try {
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error in uploading" });
  }
};
