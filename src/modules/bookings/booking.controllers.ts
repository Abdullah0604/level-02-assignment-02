import { Request, Response } from "express";
import { bookingDataValidation } from "../../helpers/bookingDataValidation";
import { bookingServices } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
  const validatedMessage = bookingDataValidation(req.body);
  if (validatedMessage) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: validatedMessage,
    });
  }

  try {
    const result: any = await bookingServices.createBookingDB(req.body);
    if (result?.statusCode) {
      return res.status(result.statusCode).json({
        success: false,
        message:
          result.statusCode == 404
            ? "Vehicle Not Found"
            : "Vehicle is already Booked",
        errors:
          result.statusCode == 404
            ? "Vehicle doesn't exist. Please provide a valid vehicle id."
            : "Vehicle is not available right now.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Not created yet. just testing",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed To create booking",
      errors: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookingsDB(req.user!);
    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "no bookings found",
        errors: "Bookings is not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed To create booking",
      errors: error.message,
    });
  }
};
export const bookingControllers = {
  createBooking,
  getBookings,
};
