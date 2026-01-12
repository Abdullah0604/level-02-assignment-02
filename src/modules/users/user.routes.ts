import { Router } from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", auth("admin"), userControllers.getUsers);

router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
