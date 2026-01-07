import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
const signupUserDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hasedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [name, email, hasedPassword, phone, role]
  );

  delete result.rows[0].password;
  return result;
};

const signinUserDB = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
    email,
  ]);

  if (!result.rows.length) return null;

  const user = result.rows[0];
  const isMatchedPassword = await bcrypt.compare(
    password as string,
    user.password
  );

  if (!isMatchedPassword) return false;

  const secret = config.jwt_secret as string;
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role, email: user.email },
    secret,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};

export const authServices = {
  signupUserDB,
  signinUserDB,
};
