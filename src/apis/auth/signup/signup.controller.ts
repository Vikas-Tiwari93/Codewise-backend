import { Request, Response } from "express";

import { SERVER_ERROR } from "../../../utilities/constants/http-constants";

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
    isAgreement,
    userName,
  } = req.body;

  const { authToken, refreshToken } = generateJwtTokens(
    { userName, isAdmin: true },
    secretKey
  );

  const name = firstName + " " + lastName;
  const payload = {
    email,
    name,
    userName,
    password: await encryptPassword(password),
    organisationName,
    organisationId,
    attachment,
    isAgreement,
    isActive: true,
    authToken,
  };
  try {
    const isAdminRegistered = await getRecordDetails(Admin, {
      userName,
    });
    if (!isAdminRegistered.hasData) {
      const admin = await createSingleRecord(Admin, payload);

      res.json({ message: "User signed up successfully" });
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
    isAgreement,
    userName,
  } = req.body;

  const { authToken, refreshToken } = generateJwtTokens(
    { userName, isAdmin: true },
    secretKey
  );

  const name = firstName + " " + lastName;
  const payload = {
    email,
    name,
    userName,
    password: await encryptPassword(password),
    organisationName,
    organisationId,
    attachment,
    isAgreement,
    isActive: true,
    authToken,
  };
  try {
    const isStudentRegistered = await getRecordDetails(Student, {
      userName,
      password,
    });
    console.log(isStudentRegistered);
    if (!isStudentRegistered.hasData) {
      const admin = await createSingleRecord(Student, payload);
      console.log({ admin });

      res.json({ message: "User signed up successfully" });
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
