import { pool } from "../../config/db";

const createBookingDB = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  const vehicleResult = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
    vehicle_id,
  ]);

  if (!vehicleResult.rowCount) {
    return {
      statusCode: 404,
    };
  }
  if (vehicleResult.rows[0].availability_status === "booked") {
    return {
      statusCode: 400,
    };
  }

  console.log("vehicle results: ", vehicleResult);
  //
  const vehicle = vehicleResult.rows[0];
  const diffTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalCost = vehicle.daily_rent_price * totalDays;
  const status = "active";
  const result = await pool.query(
    `INSERT INTO bookings
       (customer_id ,
        vehicle_id ,
        rent_start_date ,
        rent_end_date ,
        total_price  ,
        status) VALUES( $1, $2, $3, $4, $5 , $6 ) RETURNING *
        `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalCost, status]
  );

  if (result.rowCount) {
    await pool.query("UPDATE vehicles SET availability_status=$1 WHERE id=$2", [
      "booked",
      vehicle_id,
    ]);

    return result;
  }
};

const getAllUserBookingsDB = async (payload: Record<string, unknown>) => {
  const result = await pool.query("SELECT * FROM bookings");
  return result;
};
const getUserBookingsDB = async (customerID: string) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1 ",
    [customerID]
  );
  return result;
};

const updateBookingDB = async (payload: Record<string, unknown>) => {
  //   const result =
  //   return result
};

export const bookingServices = {
  createBookingDB,
  getAllUserBookingsDB,
  getUserBookingsDB,
  updateBookingDB,
};
