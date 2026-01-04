import { Router } from "express";
import { userControllers } from "./user.controllers";

const router = Router();

router.get("/", userControllers.getUsers);

router.put("/:userId", userControllers.updateUser);

router.delete("/:userId", userControllers.deleteUser);

export const userRoutes = router;
