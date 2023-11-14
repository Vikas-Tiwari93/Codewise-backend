import jwt from "jsonwebtoken";
export const generateJwtTokens = <T>(
  payloadObject: string | object | Buffer,
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
