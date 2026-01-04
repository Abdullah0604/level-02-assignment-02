import { Router } from "express";

const router = Router();

router.get("/");

router.put("/:userId");

router.delete("/:userId");

export const userRoutes = router;
