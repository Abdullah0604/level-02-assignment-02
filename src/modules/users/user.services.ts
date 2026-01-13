import { pool } from "../../config/db";

type User = { role: string; id: number };
const getUsersDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

const updateUserDB = async (payload: Record<string, unknown>) => {
  const { name, email, phone, role, userId, user } = payload;

  const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  if (!userResult.rows.length) {
    throw { status: 404, message: "User not found" };
  }

  if ((user as User).role === "customer") {
    if (userResult.rows[0].id !== (user as User).id) {
      throw {
        status: 403,
        message: "Users can update only their own profile",
      };
    }

    if (role) {
      throw {
        status: 403,
        message: "Only admin can update user role",
      };
    }
  }

  const userData = userResult.rows[0];

  const updatedName = name ?? userData.name;
  const updatedEmail = email ?? userData.email;
  const updatedPhone = phone ?? userData.phone;
  const updatedRole = role ?? userData.role;

  const result = await pool.query(
    `UPDATE users SET 
     name = $1, name,
     email = $2, email,
     phone = $3, phone,
     role = $4, role WHERE id=$5 RETURNING *`,
    [updatedName, updatedEmail, updatedPhone, updatedRole, userId]
  );

  delete result.rows[0].password;
  return result;
};

const deleteUserDB = async (userId: string | number) => {
  const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  if (!userResult.rows.length) {
    throw { status: 404, message: "User not found" };
  }

  const userBookingsResult = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1",
    [userId]
  );

  const hasActiveBooking = userBookingsResult.rows.some(
    (b) => b.status === "active"
  );

  if (hasActiveBooking) {
    throw {
      status: 403,
      message: "User has active bookings. Cannot delete user",
    };
  }

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
