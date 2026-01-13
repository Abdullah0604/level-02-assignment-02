import { pool } from "../../config/db";
import { bookingServices } from "../bookings/booking.services";
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

  // system auto update
  bookingServices.systemAutoUpdateBooking();
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

  const vehicleResult = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [vehicleId]
  );

  if (!vehicleResult.rows.length) {
    throw {
      status: 404,
      message: "Vehicle is not found with this id",
    };
  }

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
  const vehicleResult = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
    payload,
  ]);

  if (!vehicleResult.rows.length) {
    throw {
      status: 404,
      message: "No vehicle found with this id",
    };
  }

  const vehicleBookingResult = await pool.query(
    "SELECT * FROM bookings WHERE vehicle_id=$1",
    [payload]
  );

  const hasActiveBooking = vehicleBookingResult.rows.some(
    (r) => r.status === "active"
  );

  if (hasActiveBooking) {
    throw {
      status: 403,
      message: "Vehicle has active bookings. Cannot delete vehicle",
    };
  }

  // if there is no booking with that id, that means the vehicle is now available
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
