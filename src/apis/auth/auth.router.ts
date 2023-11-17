import express from "express";
import {
  SigninController,
  generateAuthTokenController,
} from "./signin/signin.controller";
import {
  SignupControllerAdmin,
  SignupControllerStudent,
  uploadsController,
} from "./signup/signup.controller";
import { signInSchema, validator } from "./signin/signin.validation";
import {
  changePassword,
  emailOtp,
  otpValidate,
} from "./password/passwords.controller";
import { signUpAdminSchema } from "./signup/signup.validation";

export const AuthRouter = express.Router();
AuthRouter.post("/signin", validator.body(signInSchema), SigninController);
AuthRouter.post("/signin/authtoken", generateAuthTokenController);
AuthRouter.post("/signup/uploads", uploadsController);
AuthRouter.post(
  "/signup/admin",
  validator.body(signUpAdminSchema),
  SignupControllerAdmin
);
AuthRouter.post(
  "/signup/student",
  validator.body(signUpAdminSchema),
  SignupControllerStudent
);
AuthRouter.post("/password/emailotp", emailOtp);
AuthRouter.post("/password/otpvalidate", otpValidate);
AuthRouter.post("/password/changepassword", changePassword);
