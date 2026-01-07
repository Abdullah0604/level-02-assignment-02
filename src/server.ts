import express, { Request, Response } from "express";
import { initDB, pool } from "./config/db";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();
const port = 5000;

app.use(express.json());

initDB();

app.use("/api/v1/vehicles", vehiclesRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "server is working",
  });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users(name, email, password, phone, role) VALUES($1, $2,$3,$4,$5) RETURNING *",
      [name, email, password, phone, role]
    );
    console.log(result);
    res.status(200).json({
      success: true,
      message: "User is created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("server is running on port ", port);
});
