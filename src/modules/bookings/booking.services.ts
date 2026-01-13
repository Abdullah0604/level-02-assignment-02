import { pool } from "../../config/db";

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
        status) VALUES( $1, $2, $3, $4, $5 , $6 ) RETURNING  id ,customer_id, vehicle_id, rent_start_date::text, rent_end_date::text, total_price, status

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

  // system auto update after end the rent end date
  systemAutoUpdateBooking();

  // for customer own bookings view
  if (role === "customer") {
    const result = await pool.query(
      `SELECT  id,
       customer_id,
       vehicle_id,
       rent_start_date::text,
       rent_end_date::text, total_price, status FROM bookings WHERE customer_id= $1`,
      [id]
    );

    if (!result.rows.length) {
      throw {
        status: 200,
        message: "No bookings found with this customer id",
      };
    }

    const bookings = await Promise.all(
      result.rows.map(async (booking) => {
        const vehicleResult = await pool.query(
          "SELECT * FROM vehicles WHERE id = $1",
          [booking.vehicle_id]
        );

        if (!vehicleResult.rows.length)
          return {
            ...booking,
            vehicle: {
              message: "Vehicle Doesn't exists",
            },
          };

        return {
          ...booking,
          vehicle: {
            vehicle_name: vehicleResult.rows[0].vehicle_name,
            registration_number: vehicleResult.rows[0].registration_number,
            type: vehicleResult.rows[0].type,
          },
        };
      })
    );
    return { bookings, message: "Your bookings retrieved successfully" };
  }

  // for admin view
  const result = await pool.query(`SELECT id,
  customer_id,
  vehicle_id,
  rent_start_date::text,
  rent_end_date::text, total_price, status FROM bookings`);

  if (!result.rows.length) {
    throw {
      status: 200,
      message: "No bookings found",
    };
  }

  const bookings = await Promise.all(
    result.rows.map(async (booking) => {
      const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
        booking.customer_id,
      ]);

      const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [booking.vehicle_id]
      );

      const customer = userResult.rows.length
        ? { name: userResult.rows[0].name, email: userResult.rows[0].email }
        : {
            message: "Vehicle Doesn't exists",
          };

      const vehicle = vehicleResult.rows.length
        ? {
            vehicle_name: vehicleResult.rows[0].vehicle_name,
            registration_number: vehicleResult.rows[0].registration_number,
          }
        : {
            message: "Vehicle Doesn't exists",
          };

      return {
        ...booking,
        customer: customer,
        vehicle: vehicle,
      };
    })
  );
  return { bookings, message: "Bookings retrieved successfully" };
};

const updateBookingDB = async (payload: Record<string, unknown>) => {
  const { status, bookingId, role } = payload;

  const bookingResult = await pool.query(
    `SELECT id,
       customer_id,
       vehicle_id,
       rent_start_date::text,
       rent_end_date::text, total_price, status FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (!bookingResult.rows.length) {
    throw {
      status: 404,
      message: "No booking found with this booking id",
    };
  }

  if (bookingResult.rows[0].status !== "active") {
    throw {
      status: 400,
      message:
        "Booking is not active now. Only active booking status can be updated",
    };
  }

  const booking = bookingResult.rows[0];
  const bookingStartDate = new Date(booking.rent_start_date as string);
  const now = new Date();

  // for user updatation
  if (role === "customer") {
    if ((status as string).toLowerCase() !== "cancelled") {
      throw {
        status: 400,
        message: "Only user can send cancelled status to update status.",
      };
    }

    if (bookingStartDate <= now) {
      throw {
        status: 400,
        message: "Booking cannot be cancelled after the start date",
      };
    }

    const result = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING id,
       customer_id,
       vehicle_id,
       rent_start_date::text,
       rent_end_date::text, total_price, status`,
      [status, bookingId]
    );

    if (result.rows.length) {
      await pool.query(
        "UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *",
        ["available", booking.vehicle_id]
      );
    }

    return {
      updatedBooking: result.rows[0],
      message: "Booking cancelled successfully",
    };
  }

  // for admin updatation
  if ((status as string).toLowerCase() !== "returned") {
    throw {
      status: 400,
      message: "Admins can only mark bookings as returned",
    };
  }

  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING id,
       customer_id,
       vehicle_id,
       rent_start_date::text,
       rent_end_date::text, total_price, status`,
    [status, bookingId]
  );

  if (result.rows.length) {
    const vehicleResult = await pool.query(
      "UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status",
      ["available", booking.vehicle_id]
    );

    return {
      updatedBooking: {
        ...result.rows[0],
        vehicle: {
          availability_status: vehicleResult.rows[0].availability_status,
        },
      },
      message: "Booking marked as returned. Vehicle is now available",
    };
  }
};

export const bookingServices = {
  createBookingDB,
  getBookingsDB,
  updateBookingDB,
  systemAutoUpdateBooking,
};
