import e, { Request, Response } from "express";
import { vehicleDataValidation } from "../../helpers/vehicleDataValidation";
import { vehicleServices } from "./vehicles.services";
import sendError from "../../helpers/sendError";
import sendSuccess from "../../helpers/sendSuccess";

const createVehicle = async (req: Request, res: Response) => {
  const validatedMessage = vehicleDataValidation(req.body);
  if (validatedMessage) {
    return sendError(res, 400, "Validation error", validatedMessage);
  }

  try {
    const result = await vehicleServices.createVehicleDB(req.body);

    // console.log("create vehicle:  ", result);

    return sendSuccess(
      res,
      201,
      "Vehicle created successfully",
      result.rows[0]
    );
  } catch (error: any) {
    // console.log(error);

    if (error.code === "23505") {
      return sendError(
        res,
        400,
        "Duplicate value",
        "registration number must be unique. Please provide a unique registration number."
      );
    }

    return sendError(
      res,
      500,
      "Internal server error",
      error.message || "Failed to create vehicle!"
    );
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehiclesDB();

    // console.log("all vehicles ", result);
    if (!result.rows.length) {
      return sendSuccess(res, 200, "No vehicles found", []);
    }

    return sendSuccess(
      res,
      200,
      "Vehicles retrieved successfully",
      result.rows
    );
  } catch (error: any) {
    sendError(res, 500, "Failed to retrieve vehicles!", error.message);
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicleDB(
      req.params.vehicleId!
    );

    // console.log("single vehicle: ", result);
    if (!result.rows.length) {
      return sendError(
        res,
        404,
        "No vehicle found",
        "No vehicle found with the given id "
      );
    }
    return sendSuccess(
      res,
      200,
      "Vehicle retrieved successfully",
      result.rows[0]
    );
  } catch (error: any) {
    // console.log(error);
    return sendError(
      res,
      500,
      "Failed to retrieve vehicles!",
      error.message || "Internal Server Error"
    );
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const { availability_status } = req.body;
  const status = ["available", "booked"];

  if (!status.includes(availability_status)) {
    return sendError(
      res,
      400,
      "Invalid input",
      "availability_status will be exactly available or booked"
    );
  }
  try {
    const result = await vehicleServices.updateVehicleDB({
      ...req.body,
      vehicleId: req.params.vehicleId,
    });

    // console.log("updated vechile: ", result);

    return sendSuccess(
      res,
      200,
      "Vehicle updated successfully",
      result.rows[0]
    );
  } catch (error: any) {
    return sendError(
      res,
      error.status || 500,
      "Failed to update vehicle!",
      error.message || "Internal server error"
    );
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicleDB(req.params.vehicleId!);

    console.log("deleted vehicle: ", result);

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    return sendError(
      res,
      error.status || 500,
      "Failed to delete vehicle!",
      error.message || "Internal Server Error"
    );
  }
};

export const vehiclesControllers = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
