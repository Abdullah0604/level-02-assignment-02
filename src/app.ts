import express, { Request, Response } from "express";
import { initDB, pool } from "./config/db";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

app.use(express.json());

initDB();

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/vehicles", vehiclesRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "server is working",
  });
});

export default app;
