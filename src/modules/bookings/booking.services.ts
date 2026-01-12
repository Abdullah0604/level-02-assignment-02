import { pool } from "../../config/db";

const createBookingDB = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  const userResult = await pool.query("SELECT * FROM users WHERE id=$1", [
    customer_id,
  ]);

  if (!userResult.rows.length) {
    throw {
      status: 404,
      message: "No customer found with this customer id",
    };
  }

  const vehicleResult = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
    vehicle_id,
  ]);

  if (!vehicleResult.rows.length) {
    throw {
      status: 404,
      message: "No vehicle found with this vehicle id",
    };
  }

  if (vehicleResult.rows[0].availability_status === "booked") {
    throw {
      status: 400,
      message: "Vehicle is already Booked",
    };
  }

  // console.log("vehicle results: ", vehicleResult);

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

    return {
      booking: result.rows[0],
      vehicle: {
        vehicle_name: vehicleResult.rows[0].vehicle_name,
        daily_rent_price: vehicleResult.rows[0].daily_rent_price,
      },
    };
  }
};

const getBookingsDB = async (payload: Record<string, unknown>) => {
  const { id, role } = payload;
  if (role === "customer") {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE customer_id=$1",
      [id]
    );
    return result;
  }
  const result = await pool.query("SELECT * FROM bookings");
  return result;
};

const updateBookingDB = async (payload: Record<string, unknown>) => {
  const { status, bookingId, role } = payload;

  const bookingResult = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );
  const booking = bookingResult.rows[0];
  const bookingStartDate = new Date(booking.rent_start_date as string);
  const now = new Date();

  if (role === "customer") {
    if ((status as string).toLowerCase() !== "cancelled") {
      return {
        errorMessage: "Customers can only cancel bookings",
      };
    }

    if (bookingStartDate <= now) {
      return {
        errorMessage: "Booking cannot be cancelled after the start date",
      };
    }

    const result = await pool.query(
      "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
      [status, bookingId]
    );
    if (result.rows.length) {
      await pool.query(
        "UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *",
        ["available", booking.vehicle_id]
      );
    }
    return result;
  }

  if ((status as string).toLowerCase() !== "returned") {
    return {
      errorMessage: "Admins can only mark bookings as returned",
    };
  }

  const result = await pool.query(
    "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
    [status, bookingId]
  );

  if (result.rows.length) {
    await pool.query(
      "UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *",
      ["available", booking.vehicle_id]
    );
    return result;
  }
};

const systemAutoUpdateBooking = async () => {
  const bookingUpdatedResult = await pool.query(
    "UPDATE bookings SET status=$1 WHERE status = $2 AND rent_end_date < NOW() RETURNING vehicle_id",
    ["returned", "active"]
  );

  if (bookingUpdatedResult.rows.length) {
    const vehicleIds = bookingUpdatedResult.rows.map((r) => r.vehicle_id);
    await pool.query(
      "UPDATE vehicles SET availability_status=$1 WHERE id=ANY($2::int[])",
      ["available", vehicleIds]
    );
  }
};

export const bookingServices = {
  createBookingDB,
  getBookingsDB,
  updateBookingDB,
};
