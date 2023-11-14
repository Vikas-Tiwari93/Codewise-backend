import { Request, Response } from "express";
import { sendEmail } from "../../../services/nodemailer/sendEmail";
import {
  createSingleRecord,
  getRecordDetails,
  updateRecord,
} from "../../../utilities/db/dbwrapper";
import { Admin } from "../../../utilities/schemas/admin";

import { OTPMap } from "../../../utilities/schemas/otpMap";
import { Student } from "../../../utilities/schemas/student";
import { SERVER_ERROR } from "../../../utilities/constants/http-constants";
import { deleteManyRecord } from "../../../utilities/db/dblayer";
const OTPGenerator = require("otp-generator");
type EmailRequest = {
  email: string;
};
type Changepassword = {
  userName: string;
  password: string;
  isAdmin: boolean;
};
type OTPValidate = {
  userName: string;
  otp: string;
};
export const emailOtp = async (req: Request, res: Response) => {
  const { email } = <EmailRequest>(<unknown>req.body);

  try {
    const user = (await getRecordDetails(Admin, { email })).hasData
      ? await getRecordDetails(Admin, { email })
      : await getRecordDetails(Student, { email });

    if (user.hasData && user?.resultSet?.isAdmin && user?.resultSet?.userName) {
      const otp = OTPGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
      });
      const emailBody = `Your OTP is: ${otp} use it to change password`;
      const pyload = {
        userName: (user?.resultSet?.userName as string) || "",
        isAdmin: (user?.resultSet?.isAdmin as boolean) || false,
        otp: otp as string,
      };

      await sendEmail(email, "OTP Confirmation", emailBody);
      const result = await createSingleRecord(OTPMap, pyload);
      res.json({ result, message: "Email sent please check ur email" });
    } else {
      res.json({ message: "No user found for the email provided" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error generating Email" });
  }
};
export const otpValidate = async (req: Request, res: Response) => {
  const { userName, otp } = <OTPValidate>(<unknown>req.body);
  try {
    const user = await getRecordDetails(OTPMap, { userName });
    if (user.hasData) {
      const result = user.resultSet;
      res.json({ result, message: "successful OTP validation" });
      await deleteManyRecord(OTPMap, { userName });
    } else {
      res.json({ message: "No user found" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error in OTP validation" });
  }
};
export const changePassword = async (req: Request, res: Response) => {
  const { userName, password, isAdmin } = <Changepassword>(<unknown>req.body);
  try {
    if (isAdmin) {
      const result = await updateRecord(Admin, { userName }, { password });
      result
        ? res.json({ result, message: "Password changed" })
        : res.json({ message: "Coundn't find User" });
    } else {
      const result = await updateRecord(Student, { userName }, { password });
      result
        ? res.json({ result, message: "Password changed" })
        : res.json({ message: "Coundn't find User" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error in password change" });
  }
};
