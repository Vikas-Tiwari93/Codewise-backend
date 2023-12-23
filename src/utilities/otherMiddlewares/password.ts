const bcrypt = require("bcrypt");
export const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
export const isPasswordVerified = async (
  password: string,
  dbPassword: string
) => {
  try {
    const passwordMatch = await bcrypt.compare(password, dbPassword);

    return passwordMatch;
  } catch (err) {}
};
