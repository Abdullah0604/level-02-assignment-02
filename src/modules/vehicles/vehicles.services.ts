import { pool } from "../../config/db";

const createVehicleDB = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles (
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getVehiclesDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles `);
  return result;
};

const getSingleVehicleDB = async (payload: string | number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id= $1`, [
    payload,
  ]);

  return result;
};

const updateVehicleDB = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    vehicleId,
  } = payload;
  const result = await pool.query(
    `
    UPDATE vehicles SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
      WHERE id = $6
      RETURNING *;
    `,
    [
      vehicle_name ?? null,
      type ?? null,
      registration_number ?? null,
      daily_rent_price ?? null,
      availability_status ?? null,
      vehicleId,
    ]
  );
  return result;
};

const deleteVehicleDB = async (payload: string | number) => {
  const vehicleResult = await pool.query(
    "SELECT * FROM bookings WHERE vehicle_id=$1",
    [payload]
  );
  if (vehicleResult.rows.length) {
    if (vehicleResult.rows[0].status === "active") {
      return {
        errorMessage:
          "Vehicle with this id is already booked and booking is in active.",
      };
    }
  }
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id= $1 RETURNING *`,
    [payload]
  );

  return result;
};

export const vehicleServices = {
  createVehicleDB,
  getVehiclesDB,
  getSingleVehicleDB,
  updateVehicleDB,
  deleteVehicleDB,
};
