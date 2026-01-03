import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";

const router = Router();

router.post("/", vehiclesControllers.createVehicle);

router.get("/", vehiclesControllers.getVehicles);

router.get("/:vehicleId", vehiclesControllers.getSingleVehicle);

router.put("/:vehicleId", vehiclesControllers.updateVehicle);

router.delete("/:vehicleId", vehiclesControllers.deleteVehicle);

export const vehiclesRoutes = router;
