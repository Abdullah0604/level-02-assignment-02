import { Router } from "express";

const router = Router();

router.post("/signup");

router.post("/signin");

export const authRoutes = router;
