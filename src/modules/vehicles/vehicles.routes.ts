import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin"), vehiclesControllers.createVehicle);

router.get("/", vehiclesControllers.getVehicles);

router.get("/:vehicleId", vehiclesControllers.getSingleVehicle);

router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateVehicle);

router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteVehicle);

export const vehiclesRoutes = router;
