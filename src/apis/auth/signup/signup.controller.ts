import { Response } from "express";

import { SERVER_ERROR } from "../../../utilities/constants/http-constants";

import { createSingleRecord } from "../../../utilities/db/dblayer";
import { Admin } from "../../../utilities/schemas/admin";
import { Student } from "../../../utilities/schemas/student";
import { ValidatedRequest } from "express-joi-validation";
import { SignupAdminRequestSchema } from "./signup.validation";
import { getRecordDetails } from "../../../utilities/db/dbwrapper";
import { generateJwtTokens } from "../../../utilities/tokenGenerators/jwt";

const secretKey = "codewise";
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
    { userName, password, isAdmin: true },
    secretKey
  );

  const name = firstName + " " + lastName;
  const payload = {
    email,
    name,
    userName,
    password,
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
      password,
    });
    if (!isAdminRegistered.hasData) {
      const admin = await createSingleRecord(Admin, payload);
      console.log({ admin });

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
    { userName, password, isAdmin: true },
    secretKey
  );

  const name = firstName + " " + lastName;
  const payload = {
    email,
    name,
    userName,
    password,
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
