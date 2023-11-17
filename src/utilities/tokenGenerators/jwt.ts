import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { updateRecord } from "../db/dbwrapper";
import { Admin } from "../schemas/admin";
import { Student } from "../schemas/student";
import { SUCCESS } from "../constants/http-constants";

export type TokenPayload = {
  userName: string;
  isAdmin: boolean;
};
type updatingJwt = {
  userName: string;
  password?: string;
  isAdmin: boolean;
};
export const generateJwtTokens = (
  payloadObject: TokenPayload,
  secretKey: string
) => {
  const authToken = jwt.sign(payloadObject, secretKey, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payloadObject, secretKey, {
    expiresIn: "7d",
  });

  return { authToken, refreshToken };
};
export const updatingJwtTokensInDb = async (
  authToken: string,
  query: updatingJwt
) => {
  const { userName, password, isAdmin } = query;
  const searchQuery = password ? { userName, password } : { userName };
  const payload = { authToken: authToken };
  if (isAdmin) {
    return await updateRecord(Admin, searchQuery, payload);
  }
  if (!isAdmin) {
    return await updateRecord(Student, query, payload);
  }
};

export const verifyJWT = (token: string, secretKey: string, res: Response) => {
  let payload: TokenPayload;
  const user: any = jwt.verify(token, secretKey);
  try {
    payload = {
      userName: user.userName,
      isAdmin: user.isAdmin,
    };
    return payload;
  } catch (err) {
    res.status(401).send("Bad credentials");
  }
};
export const isJWTExpired = (token: string) => {
  try {
    const decoded = jwt.decode(token, { complete: true }) as {
      payload: JwtPayload;
    };

    if (decoded?.payload?.exp) {
      const expirationTime = new Date(decoded.payload.exp * 1000);
      const isExpired = expirationTime < new Date() ? false : true;
      return isExpired;
    }
    return false;
  } catch (error) {
    return false;
  }
};
