import { Request, Response } from "express";
import { bookingDataValidation } from "../../helpers/bookingDataValidation";
import { bookingServices } from "./booking.services";
import sendError from "../../helpers/sendError";
import sendSuccess from "../../helpers/sendSuccess";

const createBooking = async (req: Request, res: Response) => {
  const validatedMessage = bookingDataValidation(req.body);
  if (validatedMessage) {
    return sendError(res, 400, "Validation error", validatedMessage);
  }

  try {
    const result = await bookingServices.createBookingDB(req.body);

    return sendSuccess(res, 201, "Booking created successfully", {
      ...result?.booking,
      vehicle: { ...result?.vehicle },
    });
  } catch (error: any) {
    return sendError(
      res,
      error.status || 500,
      "Failed To create booking",
      error.message || "Internal Server Error"
    );
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookingsDB(req.user!);

    return sendSuccess(res, 200, result.message, result.bookings);
  } catch (error: any) {
    if (error.status === 200) {
      return sendSuccess(res, error.status, error.message, []);
    }

    return sendError(
      res,
      error.status || 500,
      "Failed To retrieved bookings",
      error.message || "Internal Server Error"
    );
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const bookingId = Number(req.params.bookingId);
  if (Number.isNaN(bookingId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: "booking Id  must be a number",
    });
  }
  try {
    const result: any = await bookingServices.updateBookingDB({
      ...req.body,
      role: req.user!.role,
      bookingId: req.params.bookingId,
    });

    console.log("updated booking: ", result);
    if (!result.rows.length) {
      return res.status(400).json({
        success: false,
        message: "Failed to update booking!",
        errors: result.errorMessage,
      });
    }

    return res.status(200).json({
      success: true,
      message: "booking updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking!",
      errors: error.message,
    });
  }
};
export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
