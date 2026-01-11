import e, { Request, Response } from "express";
import { vehicleDataValidation } from "../../helpers/vehicleDataValidation";
import { vehicleServices } from "./vehicles.services";

const createVehicle = async (req: Request, res: Response) => {
  const validatedMessage = vehicleDataValidation(req.body);
  if (validatedMessage) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: validatedMessage,
    });
  }

  try {
    const result = await vehicleServices.createVehicleDB(req.body);

    console.log("create vehicle:  ", result);
    if (result.rows.length) {
      res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle!",
      errors:
        error.code == "23505"
          ? "registration number must be unique. Please provide a unique registration number."
          : error.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehiclesDB();

    console.log("all vehicles ", result);
    if (result.rows.length) {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles!",
      errors: error.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehicleId);
  if (Number.isNaN(vehicleId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: "Vehicle ID must be a number",
    });
  }

  try {
    const result = await vehicleServices.getSingleVehicleDB(
      req.params.vehicleId!
    );

    console.log("single vehicle: ", result);
    if (result.rows.length) {
      return res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No vehicle found",
        errors: "No vehicle found with the given id ",
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles!",
      errors: error.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehicleId);
  if (Number.isNaN(vehicleId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: "Vehicle ID must be a number",
    });
  }
  try {
    const result = await vehicleServices.updateVehicleDB({
      ...req.body,
      vehicleId: req.params.vehicleId,
    });

    console.log("updated vechile: ", result);

    if (result.rows.length) {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle!",
      errors: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehicleId);
  if (Number.isNaN(vehicleId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: "Vehicle ID must be a number",
    });
  }
  try {
    const result: any = await vehicleServices.deleteVehicleDB(
      req.params.vehicleId!
    );

    console.log("deleted vehicle: ", result);
    if (result.errorMessage) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
        errors: result.errorMessage,
      });
    }
    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Vechicle is not exist",
        errors: "No vehicle exists with this id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle!",
      errors: error.message,
    });
  }
};

export const vehiclesControllers = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
