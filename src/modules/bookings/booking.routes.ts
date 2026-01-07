import { Router } from "express";
import { bookingControllers } from "./booking.controllers";

const router = Router();

router.post("/", bookingControllers.createBooking);

// router.get("/");

// router.put("/:bookingId");
export const bookingRoutes = router;
