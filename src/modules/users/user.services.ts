import { pool } from "../../config/db";

const getUsersDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

const updateUserDB = async (payload: Record<string, unknown>) => {
  const { name, email, phone, role, userId } = payload;
  const result = await pool.query(
    `UPDATE users SET 
     name = COALESCE($1, name),
     email = COALESCE($2, email),
     phone = COALESCE($3, phone),
     role = COALESCE($4, role) WHERE id=$5 RETURNING *`,
    [name, email, phone, role, userId]
  );

  delete result.rows[0].password;
  return result;
};

const deleteUserDB = async (userId: string | number) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    userId,
  ]);

  return result;
};

export const userServices = {
  getUsersDB,
  updateUserDB,
  deleteUserDB,
};
